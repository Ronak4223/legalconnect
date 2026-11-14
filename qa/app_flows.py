"""LegalConnect demo app: end-to-end user journeys (frontend only).
Usage: python3 qa/app_flows.py http://127.0.0.1:4173/
Covers registration/login/guards, booking -> lawyer accept -> client status, reschedule/cancel/decline, lawyer onboarding,
chat, case updates, password reset, contact form, directory filters, settings persistence, earnings and mobile navigation."""
import re, sys, time, json
from playwright.sync_api import sync_playwright
BASE=(sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:4173").rstrip("/")
R=[]
def rec(name, ok, detail=""): R.append((name, bool(ok), detail)); print(("PASS " if ok else "FAIL ")+name+(" :: "+str(detail)[:200] if not ok or detail else ""), flush=True)
def newctx(b):
    c=b.new_context(viewport={"width":1440,"height":900}); c.route(re.compile(r"fonts\.g"), lambda r: r.abort())
    c.add_init_script("try{sessionStorage.setItem('lc-intro','1')}catch(e){}"); return c
def idle(p, t=20000):
    try: p.wait_for_function("!document.querySelector('.lc-curtain')?.hasAttribute('data-active')", timeout=t)
    except Exception: pass
    p.wait_for_timeout(400)
def go(p, path): p.goto(BASE+path, wait_until="load"); idle(p)
def demo(p, role):
    go(p, f"/login/{role}"); p.get_by_role("button", name="Use demo account").click(); p.wait_for_selector(".dash-content h1", timeout=20000); idle(p)
def logout(p):
    p.evaluate("(()=>{const s=JSON.parse(localStorage.getItem('lc-demo-v2'));s.session=null;localStorage.setItem('lc-demo-v2',JSON.stringify(s))})()")
def dash_h1(p): return p.locator(".dash-content h1").first.inner_text()
def first_booking_day(p):
    p.wait_for_selector(".cal-g button:not([disabled])", timeout=8000)
    p.locator(".cal-g button:not([disabled])").first.click(); p.wait_for_selector(".slot:not([disabled])", timeout=8000); p.locator(".slot:not([disabled])").first.click()

with sync_playwright() as pw:
    b=pw.chromium.launch(); errs=[]
    # ---- T1 register user
    try:
        c=newctx(b); p=c.new_page(); p.on("pageerror", lambda e: errs.append(str(e)[:150]))
        go(p,"/register/user"); p.get_by_role("button", name="Create account").click(); p.wait_for_timeout(300)
        rec("register: empty submit shows validation errors", p.locator(".err").count()>=4, p.locator(".err").count())
        p.get_by_label("Full name").fill("Test User"); p.get_by_label("Email address").fill("test.user@example.com"); p.get_by_placeholder("98765 43210").fill("9876543210")
        pw1,pw2=p.locator('input[type=password]').nth(0),p.locator('input[type=password]').nth(1)
        pw1.fill("weak"); pw1.blur(); rec("register: weak password rejected", p.locator(".err").filter(has_text=re.compile("8 characters|upper|number")).count()>=1)
        pw1.fill("Strong@123"); pw2.fill("Mismatch@1"); pw2.blur(); rec("register: confirm mismatch rejected", p.locator(".err", has_text="do not match").count()==1)
        pw2.fill("Strong@123"); p.get_by_role("button", name="Create account").click(); p.wait_for_timeout(300)
        rec("register: terms required", p.locator(".err", has_text="accept the terms").count()==1)
        p.get_by_label(re.compile("I agree")).check(); p.get_by_role("button", name="Create account").click(); p.wait_for_selector(".dash-content h1", timeout=25000); idle(p)
        rec("register: success lands on client dashboard", "/user/dashboard" in p.url and "Test" in dash_h1(p), p.url)
        p.reload(); p.wait_for_selector(".dash-content h1", timeout=20000); rec("register: session + account persist after reload", "Test" in dash_h1(p))
        # profile edit persists
        go(p,"/user/profile"); p.get_by_label("City").select_option("Delhi"); p.get_by_role("button", name="Save changes").click(); p.wait_for_timeout(500); p.reload(); p.wait_for_selector(".dash-content h1"); idle(p)
        rec("profile edit persists after reload", p.get_by_label("City").input_value()=="Delhi")
        # duplicate registration
        logout(p); go(p,"/register/user"); p.get_by_label("Full name").fill("Test User"); p.get_by_label("Email address").fill("test.user@example.com"); p.get_by_placeholder("98765 43210").fill("9876543210")
        p.locator('input[type=password]').nth(0).fill("Strong@123"); p.locator('input[type=password]').nth(1).fill("Strong@123"); p.get_by_label(re.compile("I agree")).check(); p.get_by_role("button", name="Create account").click(); p.wait_for_timeout(1800)
        rec("register: duplicate email blocked", p.get_by_role("alert").filter(has_text="already exists").count()>=1)
        c.close()
    except Exception as e: rec("T1 register flow", False, repr(e)[:200])
    # ---- T2 login + guards
    try:
        c=newctx(b); p=c.new_page(); go(p,"/user/dashboard"); rec("guard: client dashboard redirects to login", "/login/user" in p.url, p.url)
        go(p,"/lawyer/dashboard"); rec("guard: lawyer dashboard redirects to lawyer login", "/login/lawyer" in p.url, p.url)
        go(p,"/login/user"); p.get_by_label("Email address").fill("ananya.desai@example.com"); p.locator('input[type=password]').fill("Wrong@1234"); p.get_by_role("button", name="Log in").click(); p.wait_for_timeout(1500)
        rec("login: wrong password shows error", p.get_by_role("alert").filter(has_text="incorrect").count()>=1)
        p.locator('input[type=password]').fill("Demo@1234"); p.get_by_role("button", name="Log in").click(); p.wait_for_selector(".dash-content h1", timeout=25000); rec("login: valid credentials open dashboard", "Ananya" in dash_h1(p))
        go(p,"/lawyer/dashboard"); rec("guard: client cannot open lawyer dashboard", "/login/lawyer" in p.url, p.url)
        c.close()
    except Exception as e: rec("T2 login flow", False, repr(e)[:200])
    # ---- T3 booking -> lawyer accepts -> client sees
    try:
        c=newctx(b); p=c.new_page(); demo(p,"user")
        go(p,"/lawyer/aarav-mehta?book=1"); p.wait_for_selector(".modal", timeout=8000)
        p.get_by_role("button", name="Continue").click(); p.wait_for_timeout(300); rec("booking: topic required", p.locator(".err", has_text="Choose what you need").count()==1)
        p.locator(".modal select").first.select_option("Shareholder agreement"); p.get_by_role("button", name="Continue").click(); first_booking_day(p)
        p.get_by_role("button", name="Continue").click(); p.get_by_label("UPI ID").fill("bad"); p.get_by_role("button", name=re.compile("^Pay")).click(); p.wait_for_timeout(300)
        rec("booking: invalid UPI rejected", p.locator(".err", has_text="UPI ID like").count()==1)
        p.get_by_label("UPI ID").fill("ananya@okbank"); p.get_by_role("button", name=re.compile("^Pay")).click(); p.wait_for_selector("text=Request sent", timeout=8000); rec("booking: confirmation shown", True)
        p.get_by_role("button", name="View my appointments").click(); p.wait_for_selector(".dash-content h1", timeout=20000); idle(p)
        rec("booking: appears in My appointments as pending", p.locator(".row", has_text="Shareholder agreement").filter(has_text="Pending").count()>=1)
        # lawyer side
        logout(p); demo(p,"lawyer"); go(p,"/lawyer/appointments"); p.wait_for_selector(".dash-content h1")
        row=p.locator(".row", has_text="Ananya Desai").filter(has_text="Pending").first; rec("lawyer sees the new request", row.count()>0)
        row.get_by_role("button", name="Accept").click(); p.wait_for_timeout(600)
        p.get_by_role("tab", name=re.compile("Confirmed")).click(); rec("lawyer accept moves it to Confirmed", p.locator(".row", has_text="Ananya Desai").filter(has_text="Confirmed").count()>=1)
        logout(p); demo(p,"user"); go(p,"/user/appointments"); p.wait_for_selector(".dash-content h1")
        rec("client sees status updated to Confirmed", p.locator(".row", has_text="Shareholder agreement").filter(has_text="Confirmed").count()>=2, p.locator(".row", has_text="Shareholder agreement").count())
        go(p,"/user/notifications"); rec("client got 'Appointment confirmed' notification", p.locator(".nt", has_text="Appointment confirmed").count()>=1)
        c.close()
    except Exception as e: rec("T3 booking flow", False, repr(e)[:260])
    # ---- T3b auto-confirm lawyer + join room
    try:
        c=newctx(b); p=c.new_page(); demo(p,"user"); go(p,"/lawyer/priya-sharma?book=1"); p.wait_for_selector(".modal")
        p.locator(".modal select").first.select_option(index=1); p.get_by_role("button", name="Continue").click(); first_booking_day(p); p.get_by_role("button", name="Continue").click()
        p.get_by_role("radio", name=re.compile("Debit")).click(); p.get_by_label("Card number").fill("4242424242424242"); p.get_by_label("Expiry").fill("12/30"); p.get_by_label("CVV").fill("123"); p.get_by_role("button", name=re.compile("^Pay")).click(); p.wait_for_selector("text=Request sent", timeout=8000)
        p.get_by_role("button", name="View my appointments").click(); p.wait_for_selector(".dash-content h1"); idle(p); p.wait_for_timeout(13000)
        rec("other lawyers auto-confirm within seconds (demo)", p.locator(".row", has_text="Priya Sharma").filter(has_text="Confirmed").count()>=2)
        p.locator(".row", has_text="Aarav Mehta").get_by_role("button", name="Join").first.click(); p.wait_for_selector(".room", timeout=8000); rec("join meeting opens consultation room", p.locator(".room").count()==1 and p.get_by_text("End Call").count()==1)
        p.get_by_text("End Call").click(); p.wait_for_timeout(300); rec("end call closes the room", p.locator(".room").count()==0)
        c.close()
    except Exception as e: rec("T3b autoconfirm/room", False, repr(e)[:260])
    # ---- T4 lawyer onboarding
    try:
        c=newctx(b); p=c.new_page(); go(p,"/register/lawyer"); p.get_by_role("button", name="Next").click(); p.wait_for_timeout(300); rec("lawyer step 1 validates", p.locator(".err").count()>=4)
        p.get_by_label("Full name").fill("Nisha Rao"); p.get_by_label("Email address").fill("nisha.rao@example.com"); p.get_by_placeholder("98765 43210").fill("9811122233"); p.locator('input[type=password]').nth(0).fill("Strong@123"); p.locator('input[type=password]').nth(1).fill("Strong@123"); p.get_by_role("button", name="Next").click(); p.wait_for_selector("text=Your professional profile")
        p.get_by_role("button", name="Next").click(); p.wait_for_timeout(300); rec("lawyer step 2 validates", p.locator(".err").count()>=4)
        p.get_by_label("Bar Council enrolment no.").fill("bad"); p.get_by_label("Bar Council enrolment no.").blur(); rec("bar number format validated", p.locator(".err", has_text="Format like").count()==1)
        p.get_by_label("Bar Council enrolment no.").fill("D/4521/2016"); p.get_by_label("State Bar Council").select_option(index=1); p.get_by_role("button", name="LL.B.", exact=True).click(); p.get_by_label("Years of experience").fill("8"); p.get_by_label("City of practice").select_option("Delhi"); p.get_by_role("button", name="Family Law").click(); p.get_by_label(re.compile("Consultation fee")).fill("1800")
        p.get_by_label("Professional biography").fill("I advise families on divorce, custody and maintenance matters, with a focus on mediation and clear communication throughout the process."); p.get_by_role("button", name="Next").click(); p.wait_for_selector("text=Verification documents")
        p.get_by_role("button", name="Next").click(); p.wait_for_timeout(300); rec("documents required (bar certificate + ID)", p.locator(".err").count()>=2)
        open("/tmp/doc.pdf","wb").write(b"%PDF-1.4 demo"); p.locator('input[type=file]').nth(1).set_input_files("/tmp/doc.pdf"); p.locator('input[type=file]').nth(2).set_input_files("/tmp/doc.pdf"); p.get_by_role("button", name="Next").click(); p.wait_for_selector("text=Review and submit")
        p.get_by_role("button", name="Submit application").click(); p.wait_for_timeout(300); rec("declaration required on review step", p.locator(".err", has_text="declaration").count()==1)
        p.get_by_label(re.compile("I confirm")).check(); p.get_by_role("button", name="Submit application").click(); p.wait_for_selector(".dash-content h1", timeout=25000); idle(p)
        rec("lawyer registration lands on lawyer dashboard", "/lawyer/dashboard" in p.url and "Nisha" in dash_h1(p), p.url)
        rec("new lawyer sees verification in review + sample data", p.get_by_text("Verification in review").count()>=1 and p.locator(".stat-v").first.inner_text().strip().isdigit())
        go(p,"/find-lawyers?q=Nisha"); rec("new lawyer is listed in the public directory", p.get_by_role("link", name=re.compile("Nisha Rao")).count()>=1)
        c.close()
    except Exception as e: rec("T4 lawyer onboarding", False, repr(e)[:260])
    # ---- T5 messages both ways
    try:
        c=newctx(b); p=c.new_page(); demo(p,"user"); go(p,"/user/messages"); p.wait_for_selector(".conv"); n0=p.locator(".bub").count()
        p.get_by_label("Message", exact=True).fill("Thank you, I will send the documents today."); p.get_by_label("Message", exact=True).press("Enter"); p.wait_for_timeout(600)
        rec("chat: message appears immediately", p.locator(".bub.me", has_text="send the documents").count()==1)
        p.wait_for_function(f"document.querySelectorAll('.bub').length>={n0+2}", timeout=9000); rec("chat: simulated reply arrives", True)
        logout(p); demo(p,"lawyer"); go(p,"/lawyer/messages"); p.wait_for_selector(".conv"); rec("lawyer sees the client's message", p.locator(".conv", has_text="Ananya").count()>=1)
        c.close()
    except Exception as e: rec("T5 chat", False, repr(e)[:200])
    # ---- T6 case update flows
    try:
        c=newctx(b); p=c.new_page(); demo(p,"lawyer"); go(p,"/lawyer/cases"); p.locator(".li-item", has_text="Shareholder agreement").click(); p.get_by_role("button", name=re.compile("Advance to")).click(); p.wait_for_timeout(500)
        p.get_by_label("Add a note").fill("Mediation brief shared with the client."); p.get_by_role("button", name="Add note").click(); p.wait_for_timeout(400)
        logout(p); demo(p,"user"); go(p,"/user/cases"); p.locator(".li-item", has_text="Shareholder agreement").click(); p.wait_for_timeout(500)
        rec("client sees stage change + lawyer note", p.get_by_text("Mediation brief shared").count()==1 and p.locator(".timeline li.now b", has_text="Hearing").count()==1)
        go(p,"/user/notifications"); rec("client notified of case update", p.locator(".nt", has_text="moved to Hearing").count()==1)
        c.close()
    except Exception as e: rec("T6 case flow", False, repr(e)[:240])
    # ---- T7 forgot password
    try:
        c=newctx(b); p=c.new_page(); go(p,"/forgot-password"); p.get_by_label("Email address").fill("nope"); p.get_by_role("button", name="Send reset code").click(); rec("forgot: invalid email rejected", p.locator(".err").count()==1)
        p.get_by_label("Email address").fill("ananya.desai@example.com"); p.get_by_role("button", name="Send reset code").click(); p.wait_for_selector("text=Check your inbox")
        p.get_by_label("6-digit code").fill("111111"); p.locator('input[type=password]').nth(0).fill("NewPass@123"); p.locator('input[type=password]').nth(1).fill("NewPass@123"); p.get_by_role("button", name="Reset password").click(); p.wait_for_timeout(300); rec("forgot: wrong code rejected", p.locator(".err", has_text="not valid").count()==1)
        p.get_by_label("6-digit code").fill("482913"); p.get_by_role("button", name="Reset password").click(); p.wait_for_selector("text=Password updated")
        go(p,"/login/user"); p.get_by_label("Email address").fill("ananya.desai@example.com"); p.locator('input[type=password]').fill("NewPass@123"); p.get_by_role("button", name="Log in").click(); p.wait_for_selector(".dash-content h1", timeout=25000); rec("forgot: new password works for login", True)
        c.close()
    except Exception as e: rec("T7 reset", False, repr(e)[:220])
    # ---- T8 contact
    try:
        c=newctx(b); p=c.new_page(); go(p,"/contact"); p.get_by_role("button", name="Send message").click(); p.wait_for_timeout(300); rec("contact: empty form validated", p.locator(".err").count()>=3)
        p.get_by_label("Full name").fill("Ravi Kumar"); p.get_by_label("Email", exact=False).first.fill("ravi@example.com"); p.get_by_label("Topic").select_option(index=1); p.get_by_label(re.compile("How can we help")).fill("I need help understanding how to cancel an appointment after booking.")
        p.get_by_role("button", name="Send message").click(); p.wait_for_selector("text=Message received", timeout=6000); rec("contact: success state shows reference", True)
        p.get_by_role("tab", name="Payments").click(); rec("faq: category filter works", p.locator(".faq details").count()==2, p.locator(".faq details").count())
        c.close()
    except Exception as e: rec("T8 contact", False, repr(e)[:220])
    # ---- T9 directory
    try:
        c=newctx(b); p=c.new_page(); go(p,"/find-lawyers"); rec("directory: 7 lawyers listed", p.get_by_text("lawyers found").count()==1 and p.locator(".lrow").count()==5)
        p.get_by_role("button", name="Criminal Law").click(); p.wait_for_timeout(300); rec("directory: area filter", p.locator(".lrow").count()==2, p.locator(".lrow").count())
        p.get_by_role("button", name="All areas").click(); p.get_by_label("Sort by").select_option("feeDesc"); p.wait_for_timeout(300); rec("directory: fee sort desc", "Rohit" in p.locator(".lrow h3").first.inner_text(), p.locator(".lrow h3").first.inner_text())
        p.locator(".pager button", has_text=re.compile("^2$")).evaluate("e=>e.click()"); p.wait_for_timeout(400); rec("directory: pagination", p.locator(".lrow").count()==2)  # direct click: Playwright's auto-scroll fights Lenis smooth scrolling on long pages
        go(p,"/find-lawyers?q=zzzz"); rec("directory: empty state", p.get_by_text("No lawyers match").count()==1)
        go(p,"/lawyer/does-not-exist"); rec("profile: unknown lawyer shows friendly empty state", p.get_by_text("couldn’t find that lawyer").count()==1)
        go(p,"/"); p.wait_for_timeout(500); rec("home: still renders after all changes", p.locator(".hero-media").count()==1)
        c.close()
    except Exception as e: rec("T9 directory", False, repr(e)[:220])
    # ---- T10 settings persist + reset
    try:
        c=newctx(b); p=c.new_page(); demo(p,"user"); go(p,"/user/profile"); p.get_by_role("tab", name="Preferences").click(); sw=p.get_by_role("switch", name="SMS notifications"); before=sw.get_attribute("aria-checked"); sw.click(); p.reload(); p.wait_for_selector(".dash-content h1"); idle(p); p.get_by_role("tab", name="Preferences").click()
        rec("settings toggle persists", p.get_by_role("switch", name="SMS notifications").get_attribute("aria-checked")!=before)
        p.get_by_role("tab", name="Security").click(); p.get_by_role("button", name="Reset demo data").click(); p.get_by_role("button", name="Reset everything").click(); p.wait_for_timeout(2500); idle(p); rec("reset demo data signs out", p.evaluate("JSON.parse(localStorage.getItem('lc-demo-v2')).session")==None)
        c.close()
    except Exception as e: rec("T10 settings", False, repr(e)[:220])
    # ---- appointment management (reschedule / cancel / decline)
    try:
        c=newctx(b); p=c.new_page(); demo(p,"user"); go(p,"/user/appointments"); p.wait_for_selector(".dash-content h1")
        p.locator(".row", has_text="Rental agreement").get_by_role("button", name="Details").click(); p.wait_for_selector(".modal")
        p.get_by_role("button", name="Reschedule").click(); first_booking_day(p); p.get_by_role("button", name="Confirm new time").click(); p.wait_for_timeout(500)
        rec("reschedule works (dialog closes, request stays pending)", p.locator(".modal").count()==0 and p.locator(".row", has_text="Rental agreement").filter(has_text="Pending").count()==1)
        p.locator(".row", has_text="Rental agreement").get_by_role("button", name="Details").click(); p.get_by_role("button", name="Cancel", exact=True).click(); p.wait_for_selector(".modal:has-text('Cancel this appointment')"); p.get_by_role("button", name="Cancel appointment").click(); p.wait_for_timeout(500)
        rec("cancel closes dialog", p.locator(".modal").count()==0)
        p.get_by_role("tab", name=re.compile("Cancelled")).click(); rec("cancelled appointment moves to Cancelled", p.locator(".row", has_text="Rental agreement").count()>=1)
        go(p,"/user/payments"); rec("cancel refunds the payment (shows Refunded)", p.locator("tr, .row", has_text="Rental agreement").filter(has_text="Refunded").count()>=1)
        c.close()
        c=newctx(b); p=c.new_page(); demo(p,"lawyer"); go(p,"/lawyer/appointments"); p.wait_for_selector(".dash-content h1")
        p.locator(".row", has_text="Imran Qureshi").get_by_role("button", name="Decline").click(); p.wait_for_selector(".modal"); p.locator(".modal select").select_option(index=1); p.get_by_role("button", name="Decline request").click(); p.wait_for_timeout(500)
        p.get_by_role("tab", name=re.compile("Cancelled")).click(); rec("lawyer decline moves request to Cancelled", p.locator(".row", has_text="Imran Qureshi").filter(has_text="Rejected").count()>=1)
        c.close()
    except Exception as e: rec("T3 booking management", False, repr(e)[:260])
    # ---- earnings, profile edit, mobile navigation
    try:
        c=newctx(b); p=c.new_page(); demo(p,"lawyer"); go(p,"/lawyer/earnings"); p.wait_for_selector(".dash-content h1"); p.get_by_role("button", name=re.compile("^Withdraw")).first.click(); p.wait_for_selector(".modal"); p.get_by_label(re.compile("Amount")).fill("999999999"); p.get_by_role("button", name="Withdraw", exact=True).click(); p.wait_for_timeout(300)
        rec("earnings: over-limit withdrawal blocked", p.locator(".err", has_text="up to").count()==1)
        p.get_by_label(re.compile("Amount")).fill("1000"); p.get_by_role("button", name="Withdraw", exact=True).click(); p.wait_for_timeout(600); rec("earnings: withdrawal added to payout history", p.locator(".row", has_text="₹1,000").count()>=1)
        go(p,"/lawyer/profile"); p.get_by_label("Headline").fill("Corporate and commercial counsel for founders and growing teams."); p.get_by_role("button", name="Save changes").click(); p.wait_for_timeout(500)
        go(p,"/lawyer/aarav-mehta"); rec("lawyer profile edit appears on the public profile", p.get_by_text("Corporate and commercial counsel for founders").count()>=1)
        p.set_viewport_size({"width":390,"height":844}); go(p,"/lawyer/dashboard"); rec("mobile: lawyer dashboard shows bottom navigation", p.locator(".dash-bottom").is_visible() and not p.locator(".dash-side").is_visible())
        c.close()
    except Exception as e: rec("T11 earnings/profile/mobile", False, repr(e)[:240])
    print("PAGE ERRORS:", errs[:5])
    b.close()
bad=[r for r in R if not r[1]]; print(f"\nTOTAL {len(R)}  PASS {len(R)-len(bad)}  FAIL {len(bad)}")
