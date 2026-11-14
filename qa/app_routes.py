"""Opens every route as the right role at each width and checks: no console/page errors, no failed requests, no broken images,
no horizontal overflow, real content.  Usage: python3 qa/app_routes.py http://127.0.0.1:4173/ 1440,820,390"""
import sys, json, re
from playwright.sync_api import sync_playwright
BASE=(sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:4173").rstrip("/")
WIDTHS=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else [1440, 390]
PUBLIC=["/","/find-lawyers","/lawyer/aarav-mehta","/legal-services","/about","/contact","/privacy","/terms","/register/user","/register/lawyer","/login/user","/login/lawyer","/forgot-password","/nope-404"]
USER=["/user/dashboard","/user/appointments","/user/cases","/user/messages","/user/notifications","/user/payments","/user/profile"]
LAWYER=["/lawyer/dashboard","/lawyer/profile","/lawyer/appointments","/lawyer/clients","/lawyer/cases","/lawyer/messages","/lawyer/earnings","/lawyer/notifications","/lawyer/settings"]
def setsession(page, role):
    page.goto(BASE+"/privacy"); page.wait_for_timeout(1500)
    st=page.evaluate("JSON.parse(localStorage.getItem('lc-demo-v2'))")
    st['session']={"role":role,"id":"u-ananya" if role=="user" else "aarav-mehta"} if role else None
    page.evaluate("s=>localStorage.setItem('lc-demo-v2',JSON.stringify(s))", st)
def check(ctx, path, role, shots, W):
    page=ctx.new_page(); errs=[]
    page.on("pageerror", lambda e: errs.append("PAGEERR "+str(e)[:160]))
    page.on("console", lambda m: errs.append("CONSOLE "+m.text[:160]) if m.type=="error" else None)
    page.on("requestfailed", lambda r: errs.append("REQFAIL "+r.url[-60:]) if "fonts.g" not in r.url else None)
    setsession(page, role) if role!="keep" else None
    page.goto(BASE+path, wait_until="load")
    try: page.wait_for_selector("h1", timeout=9000, state="attached")
    except Exception: errs.append("NO H1")
    try: page.wait_for_function("!document.querySelector('.lc-curtain')?.hasAttribute('data-active')", timeout=15000)
    except Exception: pass
    page.wait_for_timeout(900)
    # scroll to trigger lazy images / reveals
    h=page.evaluate("document.documentElement.scrollHeight"); y=0
    while y<h and y<6000: page.evaluate(f"window.scrollTo(0,{y})"); page.wait_for_timeout(80); y+=900
    page.evaluate("window.scrollTo(0,0)"); page.wait_for_timeout(400)
    info=page.evaluate("""()=>{const bad=[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src).map(i=>i.src.slice(-40));
      const hid=[...document.querySelectorAll('main *, .dash-content *')].filter(e=>{const s=getComputedStyle(e);return s.opacity==='0'&&e.getBoundingClientRect().width>0&&!e.closest('.rv:not(.in)')&&!e.closest('[hidden]')&&!e.classList.contains('sr-only')}).length;
      return {url:location.pathname,h1:(document.querySelector('h1')||{}).innerText?.slice(0,50),sw:document.documentElement.scrollWidth,iw:innerWidth,bad,len:document.body.innerText.length}}""")
    ov = info['sw']>W+1
    status="OK" if not errs and not ov and not info['bad'] and info['len']>40 and info.get('h1') else "FAIL"
    print(status, path.ljust(26), f"w={info['sw']}/{info['iw']}", repr(info.get('h1')), "bad:",info['bad'], errs[:3])
    page.close(); return status
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
    total=0; failed=0
    for W in WIDTHS:
        H=900 if W>800 else 844
        ctx=b.new_context(viewport={"width":W,"height":H}, is_mobile=W<800, has_touch=W<800)
        ctx.route(re.compile(r"fonts\.g"), lambda r: r.abort()); ctx.add_init_script("try{sessionStorage.setItem('lc-intro','1')}catch(e){}")
        res=[]
        print("== width",W,flush=True)
        for pth in PUBLIC: res.append(check(ctx,pth,None,False,W))
        for pth in USER: res.append(check(ctx,pth,"user",False,W))
        for pth in LAWYER: res.append(check(ctx,pth,"lawyer",False,W))
        total+=len(res); failed+=res.count("FAIL"); ctx.close()
    print("TOTAL",total,"FAIL",failed)
    b.close()
