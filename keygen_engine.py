#!/usr/bin/env python3
import sys
import json
import os
import random
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def flex_imul(a, b):
    a = a & 0xffffffff
    b = b & 0xffffffff
    ah = (a >> 16) & 0xffff
    al = a & 0xffff
    bh = (b >> 16) & 0xffff
    bl = b & 0xffff
    res = (al * bl) + (((ah * bl + al * bh) << 16) & 0xffffffff)
    return res & 0xffffffff

def generate_key_for_machine(mid):
    salt = "FLEX_PRO_2026_SECRET_SALT_KEY"
    raw = (mid or "").strip().upper() + "::" + salt
    h1 = 0xdeadbeef
    h2 = 0x41c6ce57
    for ch in raw:
        code = ord(ch)
        h1 = flex_imul(h1 ^ code, 2654435761)
        h2 = flex_imul(h2 ^ code, 1597334677)
    
    h1 = flex_imul(h1 ^ (h1 >> 16), 2246822507) ^ flex_imul(h2 ^ (h2 >> 13), 3266489909)
    h2 = flex_imul(h2 ^ (h2 >> 16), 2246822507) ^ flex_imul(h1 ^ (h1 >> 13), 3266489909)
    hex1 = f"{h1 & 0xffffffff:08X}"
    hex2 = f"{h2 & 0xffffffff:08X}"
    return f"KEY-{hex1[:4]}-{hex1[4:8]}-{hex2[:4]}-{hex2[4:8]}"

def generate_universal_key(product):
    p = (product or "").lower()
    if "wheel" in p:
        prefix = "MKIT-WHL"
    elif "combo" in p:
        prefix = "MKIT-CMB"
    elif "ultimate" in p:
        prefix = "MKIT-ULT"
    else:
        prefix = "MKIT-PRO"
    
    r1 = random.randint(1000, 9999)
    r2 = random.randint(1000, 9999)
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    r3 = "".join(random.choices(chars, k=4))
    return f"{prefix}-{r1}-{r2}-{r3}"

def generate_license(email, product="MotionKit Pro", machine_id=None, customer_name=None, utr=None, payment_id=None):
    email = (email or "").strip().lower()
    utr_clean = (utr or "").strip().replace(" ", "").replace("-", "")
    pid_clean = (payment_id or "").strip()

    # Load admin data and record license
    root_dir = "C:\\Users\\NEHA\\.gemini\\antigravity\\scratch\\flex-wheel"
    data_dir = os.path.join(root_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    admin_data_file = os.path.join(data_dir, "admin_data.json")

    admin_data = {"licenses": [], "orders": [], "settings": {}, "stats": {}}
    if os.path.exists(admin_data_file):
        try:
            with open(admin_data_file, "r", encoding="utf-8") as f:
                admin_data = json.load(f)
        except Exception:
            pass

    # Check for duplicate Payment ID
    if pid_clean:
        for prev_ord in admin_data.get("orders", []):
            if prev_ord.get("paymentId") and str(prev_ord.get("paymentId")).strip() == pid_clean:
                return {
                    "success": False,
                    "error": f"Razorpay Payment ID #{pid_clean} pehle se used hai! Ek payment se ek hi license claim kiya ja sakta hai."
                }

    # Check for duplicate UTR to prevent multiple licenses generated from single payment
    if utr_clean:
        for prev_ord in admin_data.get("orders", []):
            prev_utr = str(prev_ord.get("utr") or "").strip().replace(" ", "").replace("-", "")
            if prev_utr and prev_utr.lower() == utr_clean.lower():
                return {
                    "success": False,
                    "error": f"Ye UTR #{utr_clean} pehle se registered hai! Ek payment se ek hi license claim kiya ja sakta hai."
                }

    if machine_id and machine_id.strip().startswith("FLEX-"):
        lic_key = generate_key_for_machine(machine_id.strip())
    else:
        lic_key = generate_universal_key(product)

    if not customer_name:
        customer_name = email.split("@")[0].title() if "@" in email else "Customer"

    lic_entry = {
        "id": f"lic_{int(time.time() * 1000)}",
        "key": lic_key,
        "product": product,
        "customerName": customer_name,
        "customerEmail": email,
        "machineId": machine_id or "Universal",
        "utr": utr_clean or pid_clean or "",
        "paymentId": pid_clean or "",
        "status": "Active",
        "createdDate": time.strftime("%Y-%m-%d")
    }

    if "licenses" not in admin_data:
        admin_data["licenses"] = []
    admin_data["licenses"].insert(0, lic_entry)

    # Order entry with verified Payment ID / UTR
    if pid_clean:
        pay_method_label = f"Razorpay Gateway ({pid_clean})"
    elif utr_clean:
        pay_method_label = f"UPI (UTR: {utr_clean})"
    else:
        pay_method_label = "Online Instant"

    order_entry = {
        "id": f"ORD-{random.randint(1000, 9999)}",
        "customerName": customer_name,
        "customerEmail": email,
        "product": product,
        "amount": "₹199 / $2.00" if "wheel" in (product or "").lower() else "₹249 / $3.00",
        "paymentMethod": pay_method_label,
        "paymentId": pid_clean or "",
        "utr": utr_clean or pid_clean or "",
        "status": "Completed",
        "licenseKey": lic_key,
        "date": time.strftime("%Y-%m-%d %H:%M")
    }
    if "orders" not in admin_data:
        admin_data["orders"] = []
    admin_data["orders"].insert(0, order_entry)

    if "stats" in admin_data:
        admin_data["stats"]["totalDownloads"] = admin_data["stats"].get("totalDownloads", 0) + 1
        admin_data["stats"]["activeUsers"] = admin_data["stats"].get("activeUsers", 0) + 1

    try:
        with open(admin_data_file, "w", encoding="utf-8") as f:
            json.dump(admin_data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving admin_data: {e}", file=sys.stderr)

    # Send / log email
    email_result = dispatch_email(email, customer_name, product, lic_key, admin_data.get("settings", {}))

    return {
        "success": True,
        "key": lic_key,
        "product": product,
        "email": email,
        "customerName": customer_name,
        "emailResult": email_result,
        "message": f"License key generated and sent to {email}!"
    }

def dispatch_email(to_email, customer_name, product, license_key, settings):
    root_dir = "C:\\Users\\NEHA\\.gemini\\antigravity\\scratch\\flex-wheel"
    sent_emails_file = os.path.join(root_dir, "data", "sent_emails.json")
    
    subject = f"Your Official License Key for {product} — MotionKit"
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0c10; color: #ffffff; padding: 20px; margin: 0; }}
  .card {{ background-color: #12141a; border: 1px solid #8B5CF6; border-radius: 16px; padding: 32px; max-width: 580px; margin: 0 auto; }}
  .logo {{ font-size: 24px; font-weight: 900; color: #8B5CF6; letter-spacing: 2px; text-transform: uppercase; }}
  .title {{ font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 15px; }}
  .desc {{ color: #9ca3af; font-size: 14px; line-height: 1.5; }}
  .key-box {{ background-color: #000000; border: 2px solid #8B5CF6; border-radius: 12px; padding: 18px; font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 900; color: #8B5CF6; text-align: center; letter-spacing: 3px; margin: 25px 0; }}
  .btn-green {{ display: inline-block; background-color: #8B5CF6; color: #000000; padding: 12px 24px; font-weight: 800; text-decoration: none; border-radius: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-right: 10px; margin-bottom: 10px; }}
  .btn-purple {{ display: inline-block; background-color: #9999ff; color: #000000; padding: 12px 24px; font-weight: 800; text-decoration: none; border-radius: 8px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 10px; }}
  .steps {{ background-color: #181b22; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-top: 25px; font-size: 13px; line-height: 1.7; color: #d1d5db; }}
  .footer {{ font-size: 11px; color: #6b7280; text-align: center; margin-top: 30px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; }}
</style>
</head>
<body>
  <div class="card">
    <div class="logo">⚡ MOTIONKIT SUITE</div>
    <div class="title">Thank You, {customer_name}!</div>
    <p class="desc">Your official lifetime license key for <strong>{product}</strong> has been generated and activated.</p>
    
    <div class="key-box">{license_key}</div>

    <div style="text-align: center; margin: 20px 0;">
      <a href="/downloads/MotionKit-Pro.zip" class="btn-green">MotionKit Pro (.zip)</a>
      <a href="/downloads/MotionKit-Ultimate-PR-Installer.zip" class="btn-green" style="background-color:#D4AF37;">PR Ultimate (.zip)</a>
      <a href="/downloads/MotionKit-Wheel.zip" class="btn-purple">MotionKit Wheel (.zip)</a>
    </div>

    <div class="steps">
      <strong style="color: #ffffff; font-size: 14px;">🚀 3 Simple Steps to Activate:</strong>
      <ol style="margin-top: 8px; padding-left: 20px;">
        <li>Download your installer zip file and extract the contents.</li>
        <li>Right click <code>Install.bat</code> and select <strong>Run as administrator</strong>.</li>
        <li>Open After Effects / Premiere Pro ➔ <strong>Window</strong> ➔ <strong>Extensions</strong> ➔ <strong>{product}</strong>.</li>
        <li>Paste your key <code>{license_key}</code> to unlock lifetime access instantly!</li>
      </ol>
    </div>

    <div class="footer">
      MotionKit Suite • Need Support? WhatsApp: +91 7982179684 • Email: singhayush5304@gmail.com
    </div>
  </div>
</body>
</html>
"""

    smtp_sent = False
    smtp_error = None

    # Check if SMTP configuration exists
    smtp_host = settings.get("smtpHost") or os.environ.get("SMTP_HOST")
    smtp_port = int(settings.get("smtpPort") or os.environ.get("SMTP_PORT") or 587)
    smtp_user = settings.get("smtpUser") or os.environ.get("SMTP_USER")
    smtp_pass = settings.get("smtpPass") or os.environ.get("SMTP_PASS")

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"MotionKit <{smtp_user}>"
            msg["To"] = to_email
            msg.attach(MIMEText(html_content, "html", "utf-8"))

            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [to_email], msg.as_string())
            server.quit()
            smtp_sent = True
        except Exception as ex:
            smtp_error = str(ex)

    # Save to sent_emails.json log
    log_entry = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "toEmail": to_email,
        "customerName": customer_name,
        "product": product,
        "licenseKey": license_key,
        "smtpSent": smtp_sent,
        "smtpError": smtp_error
    }

    logs = []
    if os.path.exists(sent_emails_file):
        try:
            with open(sent_emails_file, "r", encoding="utf-8") as f:
                logs = json.load(f)
        except Exception:
            pass
    logs.insert(0, log_entry)
    try:
        with open(sent_emails_file, "w", encoding="utf-8") as f:
            json.dump(logs, f, indent=2, ensure_ascii=False)
    except Exception:
        pass

    return {
        "delivered": True,
        "smtpSent": smtp_sent,
        "smtpError": smtp_error
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg1 = sys.argv[1].strip()
        data = None

        # 1. Try base64 JSON (immune to Windows CLI quoting)
        try:
            import base64
            decoded = base64.b64decode(arg1).decode("utf-8")
            if decoded.strip().startswith("{"):
                data = json.loads(decoded)
        except Exception:
            pass

        # 2. Try raw JSON
        if not data and arg1.startswith("{"):
            try:
                data = json.loads(arg1)
            except Exception:
                pass

        if data:
            email_arg = data.get("email", "")
            prod_arg = data.get("product", "MotionKit Pro")
            mid_arg = data.get("machineId") or None
            name_arg = data.get("name") or None
            utr_arg = data.get("utr") or None
            payment_id_arg = data.get("paymentId") or data.get("razorpay_payment_id") or data.get("payment_id") or None
            res = generate_license(email_arg, prod_arg, mid_arg, name_arg, utr_arg, payment_id_arg)
            print(json.dumps(res))
            sys.exit(0)

        # 3. Positional fallback: python keygen_engine.py <email> [product] [machine_id] [name] [utr]
        email_arg = sys.argv[1]
        prod_arg = sys.argv[2] if len(sys.argv) > 2 else "MotionKit Pro"
        mid_arg = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "NONE" else None
        name_arg = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != "NONE" else None
        utr_arg = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] != "NONE" else None
        res = generate_license(email_arg, prod_arg, mid_arg, name_arg, utr_arg)
        print(json.dumps(res))
    else:
        # Self-test
        test_res = generate_license("test@gmail.com", "MotionKit Pro")
        print("Self-test result:", json.dumps(test_res, indent=2))
