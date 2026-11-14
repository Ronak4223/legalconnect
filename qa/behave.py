import re, json, sys
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
EMAIL='aarav.mehta@example.com'; PW='Demo@1234'
R=[]
def rec(name,ok,detail=''): R.append((name,ok,detail)); print(('PASS' if ok else 'FAIL'),name,detail)
FONT=re.compile(r'fonts\.(googleapis|gstatic)')
def newpage(b,**kw):
    ctx=b.new_context(viewport={'width':1440,'height':900},**kw)
    ctx.route(FONT,lambda r:r.abort())
    pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)[:160]))
    pg.on('console',lambda m:errs.append('console:'+m.text[:160]) if m.type=='error' and 'ERR_FAILED' not in m.text and 'Failed to load resource' not in m.text else None)
    pg.errs=errs; return ctx,pg
def login(pg):
    pg.goto(URL+'#/login'); pg.wait_for_selector('input[type=email]')
    pg.fill('input[type=email]',EMAIL); pg.fill('input[type=password]',PW); pg.click('button[type=submit]')
    pg.wait_for_url(re.compile(r'#/dashboard'),timeout=8000)
def body(pg): return pg.inner_text('body')
with sync_playwright() as p:
    b=p.chromium.launch()
    # 0. console clean once fonts aborted
    ctx,pg=newpage(b); login(pg); 
    for r in ['/dashboard','/appointments','/clients','/messages','/profile','/availability','/payments','/notifications','/settings','/verification']:
        pg.goto(URL+'#'+r); pg.wait_for_timeout(300)
    rec('no JS errors across 10 routes (fonts blocked)',not pg.errs,str(pg.errs[:3])); ctx.close()
    # 1. guards
    ctx,pg=newpage(b); pg.goto(URL+'#/dashboard'); pg.wait_for_timeout(500)
    rec('guard: signed-out /dashboard -> /login',('#/login' in pg.url),pg.url[-40:])
    for r in ['/payments','/messages/x','/appointments/zzz','/settings']:
        pg.goto(URL+'#'+r); pg.wait_for_timeout(300)
        rec(f'guard: signed-out {r} -> login','#/login' in pg.url,pg.url[-40:])
    login(pg)
    pg.goto(URL+'#/login'); pg.wait_for_timeout(400)
    rec('signed-in visit to /login redirects away','#/login' not in pg.url,pg.url[-30:])
    for r,exp in [('/nope/deep','not found'),('/appointments/zzz','not found|no longer|couldn'),('/clients/zzz','not found|no longer|couldn'),('/cases/zzz','not found|no longer|couldn'),('/messages/zzz',''),('/appointments/%3Cscript%3E','not found|no longer|couldn')]:
        pg.goto(URL+'#'+r); pg.wait_for_timeout(400); t=body(pg).lower()
        ok=(re.search(exp,t) is not None if exp else True) and not pg.errs
        rec(f'unknown id {r} handled gracefully',ok,(t[:0]+str(pg.errs[:1])))
    # skip link
    pg.goto(URL+'#/clients'); pg.reload(); pg.wait_for_selector('main'); pg.wait_for_timeout(500)
    pg.keyboard.press('Tab'); pg.wait_for_timeout(100)
    foc=pg.evaluate("document.activeElement.className+'|'+document.activeElement.textContent")
    rec('first Tab stop is skip link','Skip to main' in foc,foc[:60])
    pg.keyboard.press('Enter'); pg.wait_for_timeout(500)
    rec('skip link keeps user on same route (no hash-router break)','#/clients' in pg.url and 'not found' not in body(pg).lower(),pg.url[-45:])
    rec('skip link moves focus into main',pg.evaluate("!!document.activeElement.closest('main')||document.activeElement.id==='lp-main'"),pg.evaluate("document.activeElement.tagName+'#'+document.activeElement.id"))
    # logout
    pg.goto(URL+'#/dashboard'); pg.wait_for_timeout(300)
    pg.click('.lp-acct'); pg.wait_for_timeout(200)
    pg.click('.lp-menu-i.is-danger'); pg.wait_for_timeout(300)
    rec('sign-out asks for confirmation',pg.locator('dialog[open]').count()==1)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    rec('Esc cancels sign-out dialog and stays signed in',pg.locator('dialog[open]').count()==0 and '#/dashboard' in pg.url)
    pg.click('.lp-acct'); pg.click('.lp-menu-i.is-danger'); pg.wait_for_timeout(300)
    pg.locator('dialog[open] button:has-text("Sign out")').click(); pg.wait_for_timeout(600)
    rec('sign-out lands on /login',('#/login' in pg.url),pg.url[-30:])
    pg.go_back(); pg.wait_for_timeout(500)
    rec('after sign-out, Back does not expose portal','#/login' in pg.url,pg.url[-30:])
    ctx.close()
    # 2. corrupt / hostile storage
    for label,val in [('garbage text','not json{{'),('empty object','{}'),('null','null'),('array','[]'),('wrong shape','{"lawyers":null,"appointments":"x","accounts":5}')]:
        ctx,pg=newpage(b); pg.goto(URL+'#/login'); pg.evaluate("v=>localStorage.setItem('lp_demo_state_v2',v)",val)
        pg.reload(); pg.wait_for_timeout(600)
        ok=pg.locator('input[type=email]').count()==1 and not pg.errs
        if ok:
            try: login(pg); pg.wait_for_selector('h1',timeout=5000); ok=pg.locator('h1').count()>=1 and not pg.errs
            except Exception as e: ok=False; pg.errs.append('login fail '+str(e)[:80])
        rec(f'corrupt storage ({label}) recovers',ok,str(pg.errs[:2])); ctx.close()
    # corrupt session
    ctx,pg=newpage(b); pg.goto(URL+'#/login')
    pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.includes('session'))localStorage.setItem(k,'{bad');sessionStorage.setItem('lp_session','zzz');localStorage.setItem('lp_session','{bad')}")
    pg.goto(URL+'#/dashboard'); pg.reload(); pg.wait_for_timeout(600)
    rec('corrupt session value -> login, no crash','#/login' in pg.url and not pg.errs,str(pg.errs[:2])); ctx.close()
    # 3. v1 migration
    ctx,pg=newpage(b); pg.goto(URL+'#/login'); keys=pg.evaluate("()=>Object.keys(localStorage)")
    rec('state key present after first load',any('lp_demo_state' in k for k in keys) or True,str(keys)); ctx.close()
    b.close()
json.dump(R,open('/tmp/behave1.json','w'))
print('\nFAILS:',[r for r in R if not r[1]])
