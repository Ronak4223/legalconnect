import re,sys,json
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
AXE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','node_modules','axe-core','axe.min.js')).read()
R=[]
def rec(n,ok,d=''): R.append((n,ok,d)); print(('PASS' if ok else 'FAIL'),n,d)
def mk(b,vp=(1440,900),**kw):
    ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]},**kw); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page(); pg.errs=[]
    pg.on('pageerror',lambda e:pg.errs.append(str(e)[:150])); return ctx,pg
def login(pg):
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
def axe(pg,tag):
    pg.evaluate(AXE); r=pg.evaluate("()=>axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']})")
    v=[(x['id'],x['impact'],len(x['nodes']),x['nodes'][0]['target'][0][:60]) for x in r['violations']]
    rec(f'axe clean: {tag}',not v,str(v))
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx,pg=mk(b); login(pg)
    # Add-client dialog: focus mgmt + hostile input
    pg.goto(URL+'#/clients'); pg.wait_for_timeout(400)
    trig=pg.locator('button:has-text("Add client")').first; trig.focus(); trig.click(); pg.wait_for_timeout(350)
    inside=pg.evaluate("!!document.activeElement.closest('dialog')")
    rec('dialog open moves focus inside',inside)
    axe(pg,'Add client dialog (open)')
    for _ in range(14): pg.keyboard.press('Tab')
    rec('focus trapped in modal after 14 Tabs',pg.evaluate("!!document.activeElement.closest('dialog')"))
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    rec('Esc closes dialog',pg.locator('dialog[open]').count()==0)
    rec('focus returns to trigger',pg.evaluate("document.activeElement.textContent.includes('Add client')"),pg.evaluate("document.activeElement.textContent.slice(0,30)"))
    # empty submit shows errors, focus goes to first error
    trig.click(); pg.wait_for_timeout(300); pg.locator('dialog[open] button[type=submit]').click(); pg.wait_for_timeout(300)
    rec('empty submit shows field errors',pg.locator('dialog[open] [role=alert],dialog[open] .lp-err,dialog[open] [aria-invalid=true]').count()>0)
    rec('invalid field flagged aria-invalid',pg.locator('dialog[open] [aria-invalid=true]').count()>0)
    rec('focus moved to first invalid field',pg.evaluate("document.activeElement.getAttribute('aria-invalid')==='true'"),pg.evaluate("document.activeElement.tagName"))
    axe(pg,'Add client dialog with errors')
    # hostile add
    d=pg.locator('dialog[open]')
    d.locator('input[type=text],input:not([type])').first.fill('<img src=x onerror="window.__pwn=1">Test')
    d.locator('input[type=email]').fill('hostile@example.com'); d.locator('input[type=tel]').fill('9876543210'); d.locator('select').select_option(index=1)
    d.locator('button[type=submit]').click(); pg.wait_for_timeout(700)
    rec('hostile client added w/o execution',pg.evaluate("window.__pwn||0")==0 and not pg.errs,str(pg.errs))
    rec('hostile name rejected by validation (dialog stays open, error shown)',pg.locator('dialog[open] [aria-invalid=true]').count()>0,'')
    pg.reload(); pg.wait_for_timeout(500)
    rec('hostile name never stored or rendered after reload',pg.evaluate("window.__pwn||0")==0 and '<img src=x' not in pg.inner_text('body'))
    ctx.close()
    # Time-zone invariance
    out={}
    for tz in ['Asia/Kolkata','America/Los_Angeles','Pacific/Auckland']:
        ctx,pg=mk(b,timezone_id=tz); login(pg); pg.goto(URL+'#/appointments?tab=upcoming'); pg.wait_for_timeout(500)
        out[tz]=pg.evaluate("[...document.querySelectorAll('main li, main tr')].slice(0,4).map(e=>e.innerText.replace(/\\s+/g,' ').slice(0,90))")
        ctx.close()
    same=out['Asia/Kolkata']==out['America/Los_Angeles']==out['Pacific/Auckland']
    rec('appointment times identical across browser time zones (IST pinned)',same,'' if same else json.dumps(out)[:400])
    # reduced motion
    ctx,pg=mk(b,reduced_motion='reduce'); login(pg); pg.goto(URL+'#/clients'); pg.wait_for_timeout(300)
    pg.click('button:has-text("Add client")'); pg.wait_for_timeout(100)
    an=pg.evaluate("()=>{const d=document.querySelector('dialog[open]');const cs=getComputedStyle(d);return [cs.animationDuration,cs.transitionDuration]}")
    rec('reduced motion: dialog animation ~0',all(float(x.split(',')[0].replace('s',''))<0.05 for x in an) ,str(an))
    pg.keyboard.press('Escape')
    spin=pg.evaluate("()=>[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).animationName!=='none'&&parseFloat(getComputedStyle(e).animationDuration)>0.05).length")
    rec('reduced motion: no long running animations on page',spin==0,str(spin)); ctx.close()
    # Mobile drawer
    ctx,pg=mk(b,(390,844)); login(pg); pg.wait_for_timeout(400)
    pg.click('button[aria-label*="enu"],.lp-burger'); pg.wait_for_timeout(400)
    rec('mobile drawer opens',pg.locator('.lp-side.is-open').count()==1)
    axe(pg,'mobile drawer open')
    print('  focus in drawer?',pg.evaluate("!!document.activeElement.closest('.lp-side')"),'| aria-modal?',pg.evaluate("document.querySelector('.lp-side')?.getAttribute('aria-modal')+' role='+document.querySelector('.lp-side')?.getAttribute('role')"))
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    rec('Esc closes mobile drawer',pg.locator('.lp-side.is-open').count()==0)
    rec('focus returns to burger after drawer close',pg.evaluate("document.activeElement.className.includes('burger')"),pg.evaluate("document.activeElement.className"))
    # inert background when drawer open
    pg.click('.lp-burger'); pg.wait_for_timeout(300)
    bg=pg.evaluate("()=>{const m=document.querySelector('main');return m.closest('[inert]')?'inert':m.closest('[aria-hidden=true]')?'aria-hidden':'live'}")
    rec('page behind open drawer is inert/hidden to AT',bg!='live',bg)
    for _ in range(25): pg.keyboard.press('Tab')
    esc=pg.evaluate("!document.activeElement.closest('.lp-side')")
    rec('Tab does not escape into page behind drawer',not esc,pg.evaluate("document.activeElement.tagName+'.'+document.activeElement.className.slice(0,25)"))
    ctx.close(); b.close()
print('\nFAILS:'); [print(' ',r) for r in R if not r[1]]
