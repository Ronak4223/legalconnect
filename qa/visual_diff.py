"""Pixel-compare two builds of the lawyer portal. usage: visual_diff.py <baseline.html> <candidate.html> [outdir]"""
import sys,re,os,datetime
from playwright.sync_api import sync_playwright
from PIL import Image,ImageChops
A,B=[p if p.startswith('http') else os.path.abspath(p) for p in sys.argv[1:3]]; OUT=sys.argv[3] if len(sys.argv)>3 else '/tmp/vdiff'; os.makedirs(OUT,exist_ok=True)
PUB=['/login','/register','/forgot-password','/reset-password','/kit']
PRIV=['/dashboard','/appointments','/appointments?tab=requests','/clients','/clients?tab=cases','/messages','/profile','/availability','/payments','/notifications','/settings','/settings?tab=notifications','/verification']
NOW=datetime.datetime(2026,10,31,6,30,tzinfo=datetime.timezone.utc)
def shoot(b,path,vp,tag):
    ctx=b.new_context(viewport={'width':vp[0],'height':vp[1]},reduced_motion='reduce'); ctx.route(re.compile('fonts'),lambda r:r.abort())
    pg=ctx.new_page(); pg.clock.set_fixed_time(NOW); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:100])); pg.on('requestfailed',lambda r:errs.append('REQFAIL '+r.url[-60:]) if 'fonts' not in r.url else None)
    shots={}
    for r in PUB:
        pg.goto((path if path.startswith('http') else 'file://'+path)+'#'+r); pg.wait_for_timeout(500); shots[r]=pg.screenshot(full_page=True)
    pg.goto((path if path.startswith('http') else 'file://'+path)+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    for r in PRIV:
        pg.goto((path if path.startswith('http') else 'file://'+path)+'#'+r); pg.wait_for_timeout(600); shots[r]=pg.screenshot(full_page=True)
    ctx.close(); return shots,errs
import io
with sync_playwright() as p:
    b=p.chromium.launch(); worst=[]
    for name,vp in [('desktop',(1440,900)),('mobile',(390,844))]:
        sa,ea=shoot(b,A,vp,'A'); sb,eb=shoot(b,B,vp,'B')
        if eb: print(name,'candidate errors:',eb[:4])
        for r in sa:
            ia=Image.open(io.BytesIO(sa[r])).convert('RGB'); ib=Image.open(io.BytesIO(sb[r])).convert('RGB')
            if ia.size!=ib.size: print(f'{name:8}{r:34} SIZE DIFF {ia.size} vs {ib.size}'); worst.append((1,name,r)); continue
            d=ImageChops.difference(ia,ib).convert('L').point(lambda v:255 if v>24 else 0); n=sum(1 for v in d.getdata() if v); frac=n/(ia.size[0]*ia.size[1])
            flag='' if frac<0.0005 else '  <<<'
            print(f'{name:8}{r:34} {frac*100:6.3f}% px differ{flag}'); worst.append((frac,name,r))
            if frac>=0.0005:
                n_=r.strip('/').replace('/','_').replace('?','_').replace('=','_'); ia.save(f'{OUT}/{name}_{n_}_A.png'); ib.save(f'{OUT}/{name}_{n_}_B.png'); d.save(f'{OUT}/{name}_{n_}_D.png')
    b.close()
print('max diff %.3f%%'%(max(w[0] for w in worst)*100))
