"""Pixel-compare the React site with the original vanilla page (animations off on both). usage: site_visual_diff.py <vanilla.html> <react-url>"""
import sys,re,io,os
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
A,B=sys.argv[1],sys.argv[2]; os.makedirs('/tmp/sd',exist_ok=True)
def shot(b,url,vp):
    c=b.new_context(viewport={'width':vp[0],'height':vp[1]},reduced_motion='reduce'); c.route(re.compile('fonts\\.g'),lambda r:r.abort()); pg=c.new_page()
    pg.goto(url); pg.wait_for_timeout(1500)
    pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')"); 
    h=pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0,h,600): pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(60)
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(600)
    im=pg.screenshot(full_page=True); c.close(); return Image.open(io.BytesIO(im)).convert('RGB')
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp in [('desktop',(1440,900)),('mobile',(390,844))]:
        a=shot(b,A,vp); r=shot(b,B,vp)
        print(name,'vanilla',a.size,'react',r.size)
        if a.size!=r.size: 
            h=min(a.size[1],r.size[1]); a=a.crop((0,0,a.size[0],h)); r=r.crop((0,0,r.size[0],h)); print('  (compared on common height',h,')')
        d=ImageChops.difference(a,r).convert('L').point(lambda v:255 if v>28 else 0)
        n=sum(1 for v in d.getdata() if v); print(f'  {n/(a.size[0]*a.size[1])*100:.3f}% pixels differ')
        # per 700px band report
        W,H=d.size
        bands=[(y,sum(1 for v in d.crop((0,y,W,min(y+700,H))).getdata() if v)/(W*min(700,H-y))) for y in range(0,H,700)]
        print('  worst bands (y, %):',[(y,round(f*100,2)) for y,f in sorted(bands,key=lambda x:-x[1])[:4]])
        d.save(f'/tmp/sd/{name}_diff.png'); a.save(f'/tmp/sd/{name}_A.png'); r.save(f'/tmp/sd/{name}_B.png')
    b.close()
