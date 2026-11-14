import sys,re,os
from playwright.sync_api import sync_playwright
A,B,route=os.path.abspath(sys.argv[1]),os.path.abspath(sys.argv[2]),sys.argv[3]
JS="""()=>[...document.querySelectorAll('main *')].map(e=>{const r=e.getBoundingClientRect();return [e.tagName+'.'+(e.className&&e.className.baseVal===undefined?e.className:'').toString().split(' ').slice(0,2).join('.'),Math.round(r.width),Math.round(r.height),Math.round(r.top+scrollY)]})"""
def grab(path):
    with sync_playwright() as p:
        b=p.chromium.launch(); ctx=b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce'); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
        pg.goto('file://'+path+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
        pg.goto('file://'+path+'#'+route); pg.wait_for_timeout(600); r=pg.evaluate(JS); b.close(); return r
a,b=grab(A),grab(B); print('elements',len(a),len(b))
n=0
for x,y in zip(a,b):
    if x[:3]!=y[:3]:
        print('FIRST DIFF  A:',x,' B:',y); n+=1
        if n>=4: break
