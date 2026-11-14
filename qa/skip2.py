import re,sys
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':1440,'height':900}); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    pg.goto(URL+'#/clients'); pg.reload(); pg.wait_for_selector('main'); pg.wait_for_timeout(700)
    print('focus after reload:',pg.evaluate("document.activeElement.tagName+'#'+document.activeElement.id+' '+(document.activeElement.className||'')"))
    # Direct skip-link activation
    pg.focus('a.lp-skip'); pg.keyboard.press('Enter'); pg.wait_for_timeout(700)
    print('URL after skip Enter:',pg.url)
    print('route content:',pg.evaluate("document.querySelector('main')?.innerText.slice(0,80).replace(/\\n/g,' / ')"))
    print('focus:',pg.evaluate("document.activeElement.tagName+'#'+document.activeElement.id"))
    # reload with the hash that skip link produced -> what happens
    pg.reload(); pg.wait_for_timeout(700)
    print('after reload URL:',pg.url, '| h1:',pg.evaluate("document.querySelector('h1')?.innerText"))
    b.close()
