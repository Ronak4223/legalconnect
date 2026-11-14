import re,sys,json
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
R=[]
def rec(n,ok,d=''): R.append((n,ok,d)); print(('PASS' if ok else 'FAIL'),n,d)
XSS='<img src=x onerror="window.__pwn=(window.__pwn||0)+1">'
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1440,'height':900},accept_downloads=True); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
    dialogs=[]; pg.on('dialog',lambda d:(dialogs.append(d.message),d.dismiss()))
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    # --- Add client with hostile values
    pg.goto(URL+'#/clients'); pg.wait_for_timeout(400)
    pg.click('button:has-text("Add client")'); pg.wait_for_timeout(300)
    dlg=pg.locator('dialog[open]')
    print('dialog fields:',dlg.evaluate("d=>[...d.querySelectorAll('input,select,textarea')].map(e=>e.name+'|'+e.type+'|'+(e.labels[0]?.innerText||''))"))
    inputs=dlg.locator('input')
    inputs.nth(0).fill(XSS+'=cmd|calc')
    inputs.nth(1).fill('x@example.com'); inputs.nth(2).fill('9876543210'); 
    try: inputs.nth(3).fill('=HYPERLINK("http://evil","x")')
    except Exception as e: print('city fill',e)
    dlg.locator('button[type=submit], button:has-text("Add client")').last.click(); pg.wait_for_timeout(600)
    print('after submit dialog open:',pg.locator('dialog[open]').count(), '| url',pg.url[-40:])
    pg.wait_for_timeout(300)
    rec('XSS payload in client name not executed',pg.evaluate("window.__pwn||0")==0,'')
    rec('no injected <img onerror> element in DOM',pg.locator('main img[src="x"]').count()==0)
    rec('hostile client name rejected, never rendered','<img src=x' not in pg.inner_text('body'))
    # --- messaging composer
    pg.goto(URL+'#/messages'); pg.wait_for_timeout(500)
    first=pg.locator('a[href*="#/messages/"], [class*=thread] a, .lp-thread').first
    try:
        first.click(); pg.wait_for_timeout(400)
        ta=pg.locator('textarea').first; ta.fill(XSS+'<script>window.__pwn=9</script>'); 
        pg.locator('button:has-text("Send")').first.click(); pg.wait_for_timeout(500)
        rec('XSS in chat message not executed',pg.evaluate("window.__pwn||0")==0)
        rec('chat bubble renders payload as text',pg.locator('main img[src="x"]').count()==0)
    except Exception as e: rec('chat test ran',False,str(e)[:120])
    # --- receipts / downloads
    pg.goto(URL+'#/payments'); pg.wait_for_timeout(500)
    print('payment buttons:',pg.evaluate("[...document.querySelectorAll('main button')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,25)"))
    for label in ['Export','CSV','Download']:
        loc=pg.locator(f'button:has-text("{label}")')
        if loc.count():
            try:
                with pg.expect_download(timeout=3000) as dl: loc.first.click()
                path=dl.value.path(); txt=open(path,encoding='utf8',errors='replace').read()
                rec(f'download via "{label}" works',len(txt)>20,dl.value.suggested_filename)
                cells=[c for line in txt.splitlines() for c in re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)',line)]
                bad=[c for c in cells if re.match(r'^"?[=+\-@\t\r]',c) and not re.match(r'^"?-?[\d₹.,]+"?$',c) and not re.match(r'^"?[+\-]\d',c)]
                rec('CSV has no formula-leading cells',not bad,str(bad[:3]))
                break
            except Exception as e: print('dl err',label,str(e)[:100])
    rec('no unexpected native dialogs / JS errors',not errs and not dialogs,str(errs[:2]+dialogs[:2]))
    ctx.close()
    # --- passwords never stored
    ctx=b.new_context(); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
    pg.goto(URL+'#/register'); pg.wait_for_timeout(400)
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    dump=pg.evaluate("()=>JSON.stringify([localStorage,sessionStorage])")
    rec('password string not found in web storage','Demo@1234' not in dump and 'password' not in dump.lower().replace('passwordchanged',''),'')
    keys=pg.evaluate("()=>[Object.keys(localStorage),Object.keys(sessionStorage)]"); print('storage keys:',keys)
    ctx.close(); b.close()
print('FAILS',[r for r in R if not r[1]])
