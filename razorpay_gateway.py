#!/usr/bin/env python3
import os
import sys
import json
import hmac
import hashlib
import base64
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(env_path)

KEY_ID = os.getenv("RAZORPAY_KEY_ID")
KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

def get_client():
    if not KEY_ID or not KEY_SECRET:
        raise ValueError("Razorpay credentials missing in environment variables.")
    import razorpay
    return razorpay.Client(auth=(KEY_ID, KEY_SECRET))

def create_order(amount_paise, currency="INR", receipt=None):
    try:
        amount_int = int(amount_paise)
        if amount_int < 100:
            return {
                "statusCode": 400,
                "body": {"success": False, "error": "Minimum amount is 100 paise (₹1.00)"}
            }
        
        client = get_client()
        order_data = {
            "amount": amount_int,
            "currency": currency or "INR",
            "receipt": receipt or f"rcpt_{int(os.getpid())}"
        }
        order = client.order.create(order_data)
        return {
            "statusCode": 200,
            "body": {
                "success": True,
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": KEY_ID
            }
        }
    except Exception as ex:
        err_msg = str(ex)
        status_code = 401 if "Authentication" in err_msg or "401" in err_msg else 500
        return {
            "statusCode": status_code,
            "body": {"success": False, "error": f"Razorpay API Error: {err_msg}"}
        }

def verify_payment(order_id, payment_id, signature):
    if not order_id or not payment_id or not signature:
        return {
            "statusCode": 400,
            "body": {"success": False, "error": "Missing required fields: order_id, payment_id, and signature are required."}
        }
    
    if not KEY_SECRET:
        return {
            "statusCode": 500,
            "body": {"success": False, "error": "RAZORPAY_KEY_SECRET missing in server environment."}
        }

    try:
        # Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
        msg = f"{order_id}|{payment_id}".encode("utf-8")
        generated_signature = hmac.new(KEY_SECRET.encode("utf-8"), msg, hashlib.sha256).hexdigest()
        
        if hmac.compare_digest(generated_signature, signature):
            return {
                "statusCode": 200,
                "body": {
                    "success": True,
                    "order_id": order_id,
                    "payment_id": payment_id,
                    "verified": True
                }
            }
        else:
            return {
                "statusCode": 400,
                "body": {
                    "success": False,
                    "error": "Signature verification failed! Payment signature is invalid or tampered.",
                    "verified": False
                }
            }
    except Exception as ex:
        return {
            "statusCode": 500,
            "body": {"success": False, "error": f"Verification error: {str(ex)}"}
        }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        arg = sys.argv[1].strip()
        data = None
        try:
            decoded = base64.b64decode(arg).decode("utf-8")
            data = json.loads(decoded)
        except Exception:
            pass
        if not data and arg.startswith("{"):
            try:
                data = json.loads(arg)
            except Exception:
                pass

        if data:
            action = data.get("action")
            if action == "create_order":
                res = create_order(data.get("amount", 24900), data.get("currency", "INR"), data.get("receipt"))
            elif action == "verify_payment":
                res = verify_payment(data.get("order_id") or data.get("razorpay_order_id"),
                                     data.get("payment_id") or data.get("razorpay_payment_id"),
                                     data.get("signature") or data.get("razorpay_signature"))
            else:
                res = {"statusCode": 400, "body": {"success": False, "error": f"Unknown action: {action}"}}
            print(json.dumps(res))
            sys.exit(0)
    print(json.dumps({"statusCode": 400, "body": {"success": False, "error": "No payload provided."}}))
