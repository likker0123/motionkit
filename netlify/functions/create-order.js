const https = require('https');

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
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_TmCdDrVkr3iZWV';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'NSmAC4Z6zLhgiWDFo1a1bYF6';

    const body = JSON.parse(event.body || '{}');
    const amount = parseInt(body.amount || 24900, 10);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || ('rcpt_' + Date.now());

    if (amount < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Minimum amount is 100 paise (₹1.00)' })
      };
    }

    const postData = JSON.stringify({ amount, currency, receipt });
    const authHeader = 'Basic ' + Buffer.from(keyId + ':' + keySecret).toString('base64');

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.razorpay.com',
        path: '/v1/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: data });
          }
        });
      });

      req.on('error', err => reject(err));
      req.write(postData);
      req.end();
    });

    if (result.statusCode !== 200) {
      return {
        statusCode: result.statusCode,
        headers,
        body: JSON.stringify({ success: false, error: (result.body && result.body.error && result.body.error.description) || 'Failed to create Razorpay order' })
      };
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        order_id: result.body.id,
        amount: result.body.amount,
        currency: result.body.currency,
        key_id: keyId
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