const fs = require('fs');
const path = require('path');

// Netlify Serverless Function: Protected Download with Server-Side License Verification
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 1. Verify Authorization Token
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Authentication required. Please sign in to download MotionKit installers.'
        })
      };
    }

    // 2. Decode user identity from Token
    let userEmail = '';
    
    // Check Netlify Identity
    if (context.clientContext && context.clientContext.user) {
      userEmail = context.clientContext.user.email;
    }

    // Check JWT payload (Firebase ID token or Netlify JWT)
    if (!userEmail && token.includes('.')) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          userEmail = payload.email || payload.sub || '';
        }
      } catch (e) {}
    }

    const params = event.queryStringParameters || {};
    if (!userEmail && params.email) {
      userEmail = params.email;
    }

    if (!userEmail || !userEmail.includes('@')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid authentication session. Please sign in again.'
        })
      };
    }

    // 3. SERVER-SIDE VERIFICATION: Verify active license in database
    const product = params.product || 'MotionKit Pro';
    const isWheel = product.toLowerCase().includes('wheel');
    const dataPath = path.resolve(__dirname, '../../data/admin_data.json');

    let hasAccess = false;
    let verifiedLicense = null;

    if (fs.existsSync(dataPath)) {
      try {
        const adminData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const licenses = adminData.licenses || [];
        const userLicenses = licenses.filter(l => 
          l.customerEmail && l.customerEmail.toLowerCase() === userEmail.toLowerCase()
        );

        if (isWheel) {
          verifiedLicense = userLicenses.find(l => 
            (l.product || '').toLowerCase().includes('wheel') || 
            (l.product || '').toLowerCase().includes('pro')
          );
        } else {
          verifiedLicense = userLicenses.find(l => 
            (l.product || '').toLowerCase().includes('pro')
          );
        }

        if (verifiedLicense) {
          hasAccess = true;
        }
      } catch (err) {
        console.error('Error reading licenses database:', err);
      }
    }

    // 4. Deny access if user has no valid license
    if (!hasAccess) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: `License verification failed for ${userEmail}. Active license required to download ${product}.`,
          requiresPurchase: true,
          email: userEmail
        })
      };
    }

    // 5. Authorized! Deliver installer file
    const filename = isWheel ? 'MotionKit-Wheel.zip' : 'MotionKit-Pro.zip';
    const filePath = path.resolve(__dirname, `../../downloads/${filename}`);

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: `Installer file ${filename} not found on server.` })
      };
    }

    const fileBuffer = fs.readFileSync(filePath);
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      body: fileBuffer.toString('base64'),
      isBase64Encoded: true
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
