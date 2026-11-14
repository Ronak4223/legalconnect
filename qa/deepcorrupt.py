import re,sys,json
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
MUT={
 'verification=null':"s=>{const k=Object.keys(s.lawyers)[0];s.lawyers[k].verification=null}",
 'appointments=[{}]':"s=>{s.appointments=[{}]}",
 'appointment missing client':"s=>{delete s.appointments[0].client}",
 'notifications=[{id:1}]':"s=>{s.notifications=[{id:1}]}",
 'lawyer.availability=null':"s=>{const k=Object.keys(s.lawyers)[0];s.lawyers[k].availability=null}",
 'lawyer.clients=null':"s=>{const k=Object.keys(s.lawyers)[0];s.lawyers[k].clients=null}",
 'payouts=null':"s=>{s.payouts=null}",
}
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,js in MUT.items():
        ctx=b.new_context(viewport={'width':1440,'height':900}); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)[:90]))
        pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard')); pg.wait_for_timeout(300)
        pg.evaluate("js=>{const k='lp_demo_state_v2';const s=JSON.parse(localStorage.getItem(k));(eval(js))(s);localStorage.setItem(k,JSON.stringify(s))}",js)
        pg.reload(); pg.wait_for_timeout(700)
        txt=pg.inner_text('body').strip()
        routes_blank=[]; 
        for r in ['/dashboard','/appointments','/clients','/messages','/profile','/availability','/payments','/notifications','/settings','/verification']:
            pg.goto(URL+'#'+r); pg.wait_for_timeout(250)
            body=pg.inner_text('body').strip()
            if len(body)<40 or not pg.locator('h1').count(): routes_blank.append(r)
        recovered='Sign in' in txt or 'Dashboard' in txt
        print(f'{name:30} blank/h1-less routes: {routes_blank or "none"} | js errors: {len(errs)} {errs[:1]}')
        ctx.close()
    b.close()
