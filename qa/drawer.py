import re,sys
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
with sync_playwright() as p:
    b=p.chromium.launch()
    for w in (390,768,1024,1440):
        ctx=b.new_context(viewport={'width':w,'height':800}); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
        pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard')); pg.wait_for_timeout(400)
        info=pg.evaluate("()=>{const s=document.querySelector('.lp-side');const r=s.getBoundingClientRect();const cs=getComputedStyle(s);return {left:Math.round(r.left),right:Math.round(r.right),vis:cs.visibility,transform:cs.transform!=='none'}}")
        pg.click('main') ; pg.evaluate("document.activeElement.blur()")
        seen=[]
        for i in range(60):
            pg.keyboard.press('Tab')
            seen.append(pg.evaluate("(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();return a.closest('.lp-side')? (r.right<=0?'OFFSCREEN-SIDE':'side'):'other'})()"))
        print(w,'side:',info,'| focus stops while drawer closed ->',{k:seen.count(k) for k in set(seen)})
        ctx.close()
    b.close()
