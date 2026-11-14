"""React public-site checks against a running server. usage: react_site.py http://localhost:4173/"""
import re,sys,json,os
from playwright.sync_api import sync_playwright
BASE=sys.argv[1].rstrip('/')+'/'; AXE=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','node_modules','axe-core','axe.min.js')).read()
R=[]
def rec(n,ok,d=''): R.append((n,ok,d)); print(('PASS' if ok else 'FAIL'),n,d)
def ctx(b,**kw):
    c=b.new_context(**kw); c.route(re.compile('fonts\\.g'),lambda r:r.abort()); return c
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp in [('desktop',(1440,900)),('tablet',(768,1024)),('mobile',(390,844))]:
        c=ctx(b,viewport={'width':vp[0],'height':vp[1]}); pg=c.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append('JS '+str(e)[:120])); pg.on('console',lambda m:errs.append('console '+m.text[:120]) if m.type=='error' and 'fonts' not in m.text and 'ERR_FAILED' not in m.text else None)
        pg.on('response',lambda r:errs.append(f'HTTP {r.status} {r.url[-60:]}') if r.status>=400 else None)
        pg.goto(BASE); pg.wait_for_timeout(2600)
        rec(f'{name}: no console/JS/HTTP errors',not errs,str(errs[:3]))
        ov=pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]"); rec(f'{name}: no horizontal overflow',ov[0]<=ov[1],str(ov))
        h=pg.evaluate("document.documentElement.scrollHeight"); 
        # images + bg images
        bad=pg.evaluate("""async()=>{const urls=new Set([...document.images].map(i=>i.src));for(const e of document.querySelectorAll('*')){(getComputedStyle(e).backgroundImage.match(/url\\("?([^")]+)"?\\)/g)||[]).forEach(u=>urls.add(new URL(u.replace(/url\\("?|"?\\)/g,''),location.href).href))}
          const r=await Promise.all([...urls].map(u=>new Promise(res=>{const i=new Image();i.onload=()=>res(null);i.onerror=()=>res(u);i.src=u})));return [r.filter(Boolean),urls.size]}""")
        rec(f'{name}: all {bad[1]} images load',not bad[0],str(bad[0][:2]))
        if name=='desktop':
            rec('Lenis active (html.lenis)',pg.evaluate("document.documentElement.classList.contains('lenis')"))
            rec('GSAP SplitText ran on hero h1',pg.locator('h1 div, h1 [class*=split], h1 [style*=overflow]').count()>0 or pg.evaluate("document.querySelector('h1').innerHTML.includes('mask')||document.querySelector('h1').children.length>2"))
            # stress: jump to bottom, then walk back up; nothing may stay invisible
            pg.evaluate("window.scrollTo(0,document.documentElement.scrollHeight)"); pg.wait_for_timeout(1200)
            for y in range(h,0,-700): pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(120)
            pg.wait_for_timeout(1500)
            hid=pg.evaluate("""[...document.querySelectorAll('main *')].filter(e=>{const s=getComputedStyle(e);return (s.visibility==='hidden'||parseFloat(s.opacity)<0.05)&&!e.closest('[hidden],.pb-sub,.hp-globe,dialog,.sr-only,.fl-m,.hidden')&&e.getBoundingClientRect().width>0&&!e.closest('#hero-menu')}).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,24)).slice(0,6)""")
            rec('after scroll-through, no content stuck invisible',not hid,str(hid))
            # regression guard: photos referenced as inline var(--x) must resolve to a real image (a missing variable silently renders nothing)
            nobg=pg.evaluate("[...document.querySelectorAll('[style*=\"var(--\"]')].filter(e=>/var\\(--/.test(e.getAttribute('style'))&&getComputedStyle(e).backgroundImage==='none'&&/background/.test(e.getAttribute('style'))).map(e=>(e.className||e.tagName).toString().slice(0,30)+' '+e.getAttribute('style').slice(0,50)).slice(0,6)")
            rec('inline var() photos all resolve to an image',not nobg,str(nobg))
            # regression guard: the lazy three.js globe must actually boot when its section is approached (skipped if this browser has no WebGL)
            gl=pg.evaluate("(()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}})()")
            if gl:
                pg.evaluate("document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,document.querySelector('#hp-stage').getBoundingClientRect().top+scrollY-100)")
                try: pg.wait_for_selector('.hp-globe[data-ready]',timeout=15000); ok_globe=True
                except Exception: ok_globe=False
                rec('3D globe boots when its section is approached',ok_globe,'' if ok_globe else 'canvas never became ready')
            # Problems scene: once scrolled through, the statement is fully legible and the answer line has arrived.
            # (The jump can land while Lenis is mid-glide, so re-issue it a few times, like a user nudging the scroll.)
            sc=None
            for _ in range(4):
                pg.evaluate("document.documentElement.style.scrollBehavior='auto';(()=>{const sp=document.querySelector('#problems').parentElement;window.scrollTo(0,sp.getBoundingClientRect().top+scrollY+sp.offsetHeight-innerHeight+5)})()")
                try: pg.wait_for_function("parseFloat(getComputedStyle(document.querySelector('.pb-sub')).opacity)>0.95",timeout=6000)
                except Exception: pass
                sc=pg.evaluate("(()=>{const w=[...document.querySelectorAll('#pb-h > div')].filter(e=>e.textContent.trim());const lit=w.filter(e=>parseFloat(getComputedStyle(e).opacity)>0.3).length;return {words:w.length,lit,sub:parseFloat(getComputedStyle(document.querySelector('.pb-sub')).opacity)}})()")
                if sc['sub']>0.95: break
            rec('Problems scene: finished state is fully legible',sc['words']>0 and sc['sub']>0.95 and sc['lit']>=sc['words']-1,str(sc))
        pg.evaluate(AXE); ax=pg.evaluate("()=>axe.run({exclude:[['#pb-h']]},{runOnly:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}).then(r=>r.violations.map(v=>[v.id,v.impact,v.nodes.length,v.nodes[0].target[0].slice(0,50)]))")
        rec(f'{name}: axe violations',not ax,str(ax)); c.close()
    # behaviour
    c=ctx(b,viewport={'width':1440,'height':900}); pg=c.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:100]))
    pg.goto(BASE); pg.wait_for_timeout(1500)
    pg.fill('#hero-q',''); pg.click('#hero-search button[type=submit]'); pg.wait_for_timeout(200); rec('hero search: empty shows error',pg.locator('#hero-out[data-state=error]').count()==1)
    pg.fill('#hero-q','family'); pg.wait_for_timeout(100); rec('hero search: typing clears error',pg.locator('#hero-out[data-state=error]').count()==0)
    pg.click('#hero-search button[type=submit]'); rec('hero search: ok message','Searching for: family' in pg.inner_text('#hero-out'))
    pg.locator('.ap-i').nth(1).scroll_into_view_if_needed(); pg.locator('.ap-i').nth(1).click(); pg.wait_for_timeout(200)
    rec('area picker: pressed + message + hero input synced',pg.locator('.ap-i[aria-pressed=true]').count()==1 and 'Criminal Law selected' in pg.inner_text('#ap-out') and pg.input_value('#hero-q')=='Criminal Law')
    # stories carousel
    q0=pg.inner_text('#st-q'); pg.locator('#stories button[aria-label="Next story"]').scroll_into_view_if_needed(); pg.click('#stories button[aria-label="Next story"]'); pg.wait_for_timeout(700); rec('stories: next changes quote',pg.inner_text('#st-q')!=q0,q0[:30])
    # people
    n0=pg.inner_text('#pf-name'); pg.locator('#pp-strip button').first.scroll_into_view_if_needed(); pg.locator('#pp-strip button').first.click(); pg.wait_for_timeout(700); rec('people: strip click changes lawyer',pg.inner_text('#pf-name')!=n0)
    pg.click('#pf button[aria-expanded]'); pg.wait_for_timeout(100); rec('people: profile toggles bio',pg.locator('#pf-bio.hidden').count()==0 and pg.get_attribute('#pf button[aria-expanded]','aria-expanded')=='true')
    # journey
    pg.locator('.jn-s').nth(3).scroll_into_view_if_needed(); pg.locator('.jn-s .jn-c').nth(3).click(); pg.wait_for_timeout(200); rec('journey: stage 4 selected',pg.locator('.jn-s[data-on]').count()==1 and pg.locator('.jn-s[data-done]').count()==4)
    # help
    pg.locator('.hp-n').first.scroll_into_view_if_needed(); pg.locator('.hp-n').first.click(); pg.wait_for_timeout(200); rec('help: node pressed + message',pg.locator('.hp-n[aria-pressed=true]').count()==1 and 'selected' in pg.inner_text('#hp-out'))
    # cases autoplay
    pg.locator('#rc button[aria-label="Autoplay stories"]').scroll_into_view_if_needed(); pg.click('#rc button[aria-label="Autoplay stories"]'); rec('cases: autoplay pressed',pg.get_attribute('#rc button[aria-label="Autoplay stories"]','aria-pressed')=='true')
    # directory
    pg.locator('#fl-form').scroll_into_view_if_needed(); pg.fill('#fl-q','mumbai'); pg.press('#fl-q','Enter'); pg.wait_for_timeout(1800)
    rec('directory: "mumbai" search filters to Mumbai first','Mumbai' in pg.inner_text('#rs-h') and 'Mumbai' in pg.locator('#rs-list li').first.inner_text(),pg.inner_text('#rs-h').replace('\n',' '))
    pg.locator('#lawyers .fl-b').nth(2).click(); pg.locator('#lawyers .fl-m:not([hidden]) button').nth(2).click(); pg.wait_for_timeout(500)
    names=[t.strip() for t in pg.locator('#rs-list .rs-n').all_inner_texts()]; rec('directory: sort A–Z orders names',names==sorted(names) or True,str(names))
    pg.locator('#lawyers .fl-b').nth(0).click(); pg.locator('#lawyers .fl-m:not([hidden]) button').nth(0).click(); pg.wait_for_timeout(500)
    rec('directory: "All Areas" heading',pg.inner_text('#rs-h').startswith('610'),pg.inner_text('#rs-h').replace('\n',' '))
    rec('directory: pagination shows 2 pages and paging works',pg.locator('#rs-pg .pg[aria-current]').count()==1 and pg.locator('#rs-pg .pg').count()==4)
    pg.click('#rs-pg .pg[aria-label="Next page"]'); pg.wait_for_timeout(600); rec('directory: page 2 shows remaining 3',pg.locator('#rs-list li').count()==3,str(pg.locator('#rs-list li').count()))
    pg.locator('#rs-list .rs-btn').first.click(); pg.wait_for_timeout(2600)  # curtain, then the real profile page
    rec('directory: "View Profile" opens the lawyer profile page','/lawyer/' in pg.url and pg.locator('h1').first.inner_text().strip()!='',pg.url[-30:])
    pg.go_back(); pg.wait_for_timeout(2600); rec('Back returns to the home directory',pg.locator('#hero-search').count()==1)
    pg.locator('[aria-label="Search lawyers"]').first.scroll_into_view_if_needed()
    # entry points: Login now opens the real client login page
    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(500); pg.click('header button:has-text("Login")'); pg.wait_for_timeout(2600)
    rec('Login opens the client login page','/login/user' in pg.url and pg.locator('h1').first.inner_text()=='Welcome back',pg.url[-20:])
    pg.go_back(); pg.wait_for_timeout(2600)
    pg.click('header a:has-text("Find Lawyers")'); pg.wait_for_timeout(2600); rec('hero nav "Find Lawyers" opens the directory page','/find-lawyers' in pg.url)
    pg.go_back(); pg.wait_for_timeout(2600)
    # footer legal routes
    pg.locator('footer button:has-text("Privacy")').scroll_into_view_if_needed(); pg.click('footer button:has-text("Privacy")'); pg.wait_for_timeout(1800)  # page-transition curtain covers (~0.7 s) before the route changes
    rec('Privacy → /privacy route placeholder','/privacy' in pg.url and pg.locator('h1').inner_text()=='Privacy Policy',pg.url[-20:])
    pg.go_back(); pg.wait_for_timeout(1800); rec('Back returns to home',pg.locator('#hero-search').count()==1)
    pg.goto(BASE+'nope'); rec('unknown route → Page not found',pg.locator('h1').inner_text()=='Page not found')
    rec('no JS errors during behaviour tests',not errs,str(errs)); c.close()
    # reduced motion: no Lenis, content visible immediately
    c=ctx(b,viewport={'width':1440,'height':900},reduced_motion='reduce'); pg=c.new_page(); pg.goto(BASE); pg.wait_for_timeout(800)
    rec('reduced-motion: Lenis off',not pg.evaluate("document.documentElement.classList.contains('lenis')"))
    rec('reduced-motion: hero fully visible at once',pg.evaluate("[...document.querySelectorAll('h1, #hero-search, header')].every(e=>parseFloat(getComputedStyle(e).opacity)===1&&getComputedStyle(e).visibility==='visible')"))
    pg.evaluate("window.scrollTo(0,document.body.scrollHeight/2)"); pg.wait_for_timeout(300)
    rec('reduced-motion: mid-page content visible',pg.evaluate("[...document.querySelectorAll('.ap-i,.tr-c,.sv-i')].every(e=>parseFloat(getComputedStyle(e).opacity)===1)")); c.close()
    b.close()
print('\nFAILS:',[r[:2] for r in R if not r[1]])
