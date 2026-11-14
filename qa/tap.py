import re,sys,json
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
ROUTES=['/login','/register','/forgot-password','/dashboard','/appointments?tab=requests','/clients','/clients?tab=cases','/messages','/profile','/availability','/payments','/notifications','/settings','/settings?tab=notifications','/verification']
JS='''()=>{
 const res=[];
 const els=[...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[role=tab],[role=button]')];
 for(const e of els){
  if(e.offsetParent===null&&getComputedStyle(e).position!=='fixed')continue;
  if(e.closest('.lp-sr,.lp-skip'))continue;
  let r=e.getBoundingClientRect(); if(r.width===0||r.height===0)continue;
  let box={w:r.width,h:r.height};
  const lab=e.closest('label')||(e.labels&&e.labels[0]);
  if(lab){const lr=lab.getBoundingClientRect();box={w:Math.max(box.w,lr.width),h:Math.max(box.h,lr.height)}}
  const wrap=e.closest('.lp-input,.lp-field-in,.lp-search,.lp-sel');
  if((e.tagName==='INPUT'||e.tagName==='SELECT'||e.tagName==='TEXTAREA')&&wrap){const wr=wrap.getBoundingClientRect();box={w:Math.max(box.w,wr.width),h:Math.max(box.h,wr.height)}}
  // anchor covers if parent clickable? skip
  const inline=e.tagName==='A'&&e.closest('p,li,dd,small,span')&&getComputedStyle(e).display==='inline';
  if(box.h<36||box.w<36){
    res.push({t:e.tagName.toLowerCase(),c:(e.className||'').toString().slice(0,28),w:Math.round(box.w),h:Math.round(box.h),txt:(e.getAttribute('aria-label')||e.innerText||'').trim().slice(0,22),inline});
  }
 }return res}'''
out={}
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
    for r in ['/login','/register','/forgot-password']:
        pg.goto(URL+'#'+r); pg.wait_for_timeout(300); out[r]=pg.evaluate(JS)
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    for r in ROUTES[3:]:
        pg.goto(URL+'#'+r); pg.wait_for_timeout(400); out[r]=pg.evaluate(JS)
    b.close()
agg={}
for r,l in out.items():
    for x in l:
        k=(x['t'],x['c'],x['txt'][:18]); agg.setdefault(k,{'n':0,'dim':(x['w'],x['h']),'routes':set(),'inline':x['inline']}); agg[k]['n']+=1; agg[k]['routes'].add(r)
print(f'{len(agg)} distinct undersized (<36px) mobile targets')
for k,v in sorted(agg.items(),key=lambda kv:kv[1]['dim'][1]):
    print(f"  {k[0]:7}{k[1]:28} h={v['dim'][1]:>3} w={v['dim'][0]:>3} x{v['n']:<3}{'[inline]' if v['inline'] else '        '} '{k[2]}'  {sorted(v['routes'])[:2]}")
