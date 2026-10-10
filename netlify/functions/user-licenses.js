const fs = require('fs');
const path = require('path');

// Netlify Serverless Function: Get Authenticated User Licenses
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const params = event.queryStringParameters || {};

    let userEmail = '';
    if (context.clientContext && context.clientContext.user) {
      userEmail = context.clientContext.user.email;
    }
    if (!userEmail && token.includes('.')) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          userEmail = payload.email || payload.sub || '';
        }
      } catch (e) {}
    }
    if (!userEmail && params.email) {
      userEmail = params.email;
    }

    if (!userEmail || !userEmail.includes('@')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Unauthorized. Please sign in.' })
      };
    }

    const dataPath = path.resolve(__dirname, '../../data/admin_data.json');
    let userLicenses = [];
    if (fs.existsSync(dataPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const allLicenses = data.licenses || [];
        userLicenses = allLicenses.filter(l => 
          l.customerEmail && l.customerEmail.toLowerCase() === userEmail.toLowerCase()
        );
      } catch (e) {}
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        email: userEmail,
        licenses: userLicenses,
        hasPro: userLicenses.some(l => (l.product || '').toLowerCase().includes('pro')),
        hasWheel: userLicenses.some(l => (l.product || '').toLowerCase().includes('wheel') || (l.product || '').toLowerCase().includes('pro'))
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
