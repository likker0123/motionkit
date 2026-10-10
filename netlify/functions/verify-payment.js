const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateLicenseKey(product) {
  const isWheel = (product || '').toLowerCase().includes('wheel');
  const prefix = isWheel ? 'MKIT-WHEEL' : 'MKIT-PRO';
  const r1 = Math.floor(1000 + Math.random() * 9000);
  const r2 = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r3 = '';
  for (let i = 0; i < 4; i++) {
    r3 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ${prefix}---;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'NSmAC4Z6zLhgiWDFo1a1bYF6';
    const body = JSON.parse(event.body || '{}');

    const orderId = body.order_id || body.razorpay_order_id;
    const paymentId = body.payment_id || body.razorpay_payment_id;
    const signature = body.signature || body.razorpay_signature;
    const email = body.email || 'customer@gmail.com';
    const product = body.product || 'MotionKit Pro';

    if (!orderId || !paymentId || !signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing payment verification credentials.' })
      };
    }

    // Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(${orderId}|)
      .digest('hex');

    if (expectedSignature !== signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Signature verification failed! Payment signature is invalid or tampered.',
          verified: false
        })
      };
    }

    // Generate unique license key
    const licenseKey = generateLicenseKey(product);
    const dateStr = new Date().toISOString().split('T')[0];

    // Persist to admin_data.json if writable
    const dataPath = path.resolve(__dirname, '../../data/admin_data.json');
    try {
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (!data.licenses) data.licenses = [];
        data.licenses.unshift({
          id: 'lic_' + Date.now(),
          key: licenseKey,
          product: product,
          customerName: email.split('@')[0],
          customerEmail: email,
          machineId: 'Universal',
          paymentId: paymentId,
          orderId: orderId,
          status: 'Active',
          createdDate: dateStr
        });
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
      }
    } catch (e) {
      console.warn('Could not persist to local JSON in serverless mode:', e.message);
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        verified: true,
        order_id: orderId,
        payment_id: paymentId,
        email: email,
        product: product,
        key: licenseKey,
        licenseKey: licenseKey
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};\n