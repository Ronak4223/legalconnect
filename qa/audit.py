import json, sys, re
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
AXE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','node_modules','axe-core','axe.min.js')).read()
ROUTES=['/dashboard','/appointments','/appointments?tab=requests','/clients','/clients?tab=cases','/messages','/profile','/availability','/payments','/notifications','/settings','/settings?tab=notifications','/verification','/kit','/verify-email']
PUBLIC=['/login','/register','/forgot-password','/reset-password']
VPS={'desktop':(1440,900),'tablet':(768,1024),'mobile':(390,844)}
EMAIL='aarav.mehta@example.com'; PW='Demo@1234'
res={'console':[],'overflow':[],'axe':[],'a11y':[],'tap':[],'misc':[]}
IGN=re.compile(r'fonts\.(googleapis|gstatic)')
def hook(page,tag):
    page.on('console',lambda m: res['console'].append((tag,m.type,m.text[:200])) if m.type in('error','warning') and not IGN.search(m.text) else None)
    page.on('pageerror',lambda e: res['console'].append((tag,'pageerror',str(e)[:200])))
    page.on('requestfailed',lambda r: res['console'].append((tag,'reqfail',r.url[:100])) if not IGN.search(r.url) and not r.url.startswith('data:') else None)
def login(page):
    page.goto(URL+'#/login'); page.wait_for_selector('input[type=email],input[name=email],#email',timeout=8000)
    page.fill('input[type=email],input[name=email],#email',EMAIL)
    page.fill('input[type=password]',PW)
    page.click('button[type=submit]')
    page.wait_for_url(re.compile(r'#/(dashboard|verification|verify-email)'),timeout=8000)
PROBE='''()=>{
 const out={};
 const de=document.documentElement;
 out.scrollW=de.scrollWidth; out.clientW=de.clientWidth;
 out.h1=[...document.querySelectorAll('h1')].filter(e=>e.offsetParent!==null).length;
 out.main=document.querySelectorAll('main,[role=main]').length;
 out.skip=!!document.querySelector('a[href^="#"][class*=skip],a.lp-skip');
 const name=e=>(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')||e.innerText||e.title||e.querySelector('img[alt]')?.alt||'').trim();
 out.unnamed=[...document.querySelectorAll('button,a[href],[role=button]')].filter(e=>e.offsetParent!==null&&!name(e)).map(e=>e.outerHTML.slice(0,100));
 out.unlabeled=[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(e=>e.offsetParent!==null&&!(e.labels&&e.labels.length)&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>e.outerHTML.slice(0,100));
 out.noalt=[...document.querySelectorAll('img:not([alt])')].map(e=>e.outerHTML.slice(0,80));
 out.small=[...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,[role=tab]')].filter(e=>{if(e.offsetParent===null)return false;const r=e.getBoundingClientRect();return r.width>0&&(r.height<32||r.width<32)&&!(e.closest('.lp-sr'))}).map(e=>{const r=e.getBoundingClientRect();return `${e.tagName}.${(e.className||'').toString().slice(0,30)} ${Math.round(r.width)}x${Math.round(r.height)} "${name(e).slice(0,20)}"`});
 out.over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>de.clientWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('[style*="overflow"],.lp-scroll,.lp-tablewrap')}).slice(0,3).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,40));
 out.title=document.title;
 return out}'''
def axe(page,tag):
    page.evaluate(AXE)
    r=page.evaluate("()=>axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']})")
    for v in r['violations']:
        res['axe'].append((tag,v['id'],v['impact'],len(v['nodes']),v['nodes'][0]['target'][0][:70] if v['nodes'] else ''))
with sync_playwright() as p:
    b=p.chromium.launch()
    for vp,(w,h) in VPS.items():
        ctx=b.new_context(viewport={'width':w,'height':h}); page=ctx.new_page(); hook(page,vp)
        for r in PUBLIC:
            page.goto(URL+'#'+r); page.wait_for_timeout(350)
            o=page.evaluate(PROBE); tag=f'{vp} {r}'
            if o['scrollW']>o['clientW']: res['overflow'].append((tag,o['scrollW'],o['clientW'],o['over']))
            for k in('unnamed','unlabeled','noalt'):
                if o[k]: res['a11y'].append((tag,k,o[k][:3]))
            if o['h1']!=1: res['a11y'].append((tag,'h1count',o['h1']))
            if o['main']!=1: res['a11y'].append((tag,'main',o['main']))
            if o['small']: res['tap'].append((tag,o['small'][:6]))
            axe(page,tag)
        login(page)
        for r in ROUTES:
            page.goto(URL+'#'+r); page.wait_for_timeout(1500)  # let route-enter animation finish before scanning
            o=page.evaluate(PROBE); tag=f'{vp} {r}'
            if o['scrollW']>o['clientW']: res['overflow'].append((tag,o['scrollW'],o['clientW'],o['over']))
            for k in('unnamed','unlabeled','noalt'):
                if o[k]: res['a11y'].append((tag,k,o[k][:3]))
            if o['h1']!=1: res['a11y'].append((tag,'h1count',o['h1']))
            if o['main']!=1: res['a11y'].append((tag,'main',o['main']))
            if o['small']: res['tap'].append((tag,o['small'][:6]))
            axe(page,tag)
        ctx.close()
    b.close()
json.dump(res,open('/tmp/audit_out.json','w'),indent=1)
for k,v in res.items():
    print(f'\n##### {k}: {len(v)}')
    seen=set()
    for x in v:
        key=json.dumps(x)[:160]
        if key in seen: continue
        seen.add(key); print(' ',json.dumps(x)[:260])
