import re,sys
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
AXE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','node_modules','axe-core','axe.min.js')).read()
def rec(n,ok,d=''): print(('PASS' if ok else 'FAIL'),n,d)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1200,'height':800}); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page(); errs=[]
    pg.on('console',lambda m:errs.append(m.text[:80]) if m.type=='error' else None)
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard')); pg.wait_for_timeout(300)
    pg.evaluate("()=>{const k='lp_demo_state_v2';const s=JSON.parse(localStorage.getItem(k));const l=Object.keys(s.lawyers)[0];s.lawyers[l].consult=5;localStorage.setItem(k,JSON.stringify(s))}")
    pg.reload(); pg.wait_for_timeout(500); rec('dashboard still renders with unvalidated bad field',pg.locator('h1').count()>=1)
    pg.goto(URL+'#/profile'); pg.wait_for_timeout(700)
    t=pg.inner_text('body'); rec('render crash shows boundary, not white screen','Something went wrong' in t,repr(t[:70]))
    rec('boundary has role=alert + 2 actions',pg.locator('[role=alert]').count()==1 and pg.locator('button:has-text("Reload")').count()==1 and pg.locator('button:has-text("Restore sample data")').count()==1)
    pg.evaluate(AXE); v=pg.evaluate("()=>axe.run(document,{runOnly:['wcag2a','wcag2aa','best-practice']}).then(r=>r.violations.map(v=>v.id))"); rec('boundary screen axe-clean',not v,str(v))
    pg.screenshot(path='/tmp/boundary.png')
    pg.click('button:has-text("Restore sample data")'); pg.wait_for_timeout(900)
    rec('Restore returns to a working login',pg.locator('input[type=email]').count()==1 and '#/login' in pg.url,pg.url[-25:])
    pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    pg.goto(URL+'#/profile'); pg.wait_for_timeout(500); rec('profile works again after restore','Something went wrong' not in pg.inner_text('body') and pg.locator('h1').count()==1)
    b.close()
