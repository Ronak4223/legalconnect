import re,sys
from playwright.sync_api import sync_playwright
import os; URL=sys.argv[1] if sys.argv[1].startswith('http') else 'file://'+os.path.abspath(sys.argv[1])
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(accept_downloads=True); ctx.route(re.compile('fonts'),lambda r:r.abort()); pg=ctx.new_page()
    pg.goto(URL+'#/login'); pg.fill('input[type=email]','aarav.mehta@example.com'); pg.fill('input[type=password]','Demo@1234'); pg.click('button[type=submit]'); pg.wait_for_url(re.compile('#/dashboard'))
    pg.goto(URL+'#/payments'); pg.wait_for_timeout(500)
    with pg.expect_download() as dl: pg.click('button:has-text("Export CSV")')
    t=open(dl.value.path(),encoding='utf-8-sig').read()
    print(t[:1500])
    print('lines with leading-apostrophe numerics:',[l for l in t.splitlines() if re.search(r",'-?\d",l)])
    # receipt
    pg.locator('button:has-text("Receipt")').first.click(); pg.wait_for_timeout(600)
    print('receipt ->',pg.locator('dialog[open]').count(),'dialog | pages',len(ctx.pages))
    print(pg.evaluate("document.querySelector('dialog[open]')?.innerText.slice(0,400)"))
    print('buttons in dialog:',pg.evaluate("[...document.querySelectorAll('dialog[open] button')].map(b=>b.innerText)"))
    b.close()
