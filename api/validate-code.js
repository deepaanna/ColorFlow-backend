module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 1 day - reduces browser requests
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const VALID_CODES = {
    'LAUNCH2024': 'premium',
    'FRIEND50': 'premium',
    'BETA2024': 'premium',
    'DEEPA': 'premium'  // Test code for you!
  };
  
  const { code } = req.body || {};
  
  if (!code) {
    return res.status(400).json({
      valid: false,
      message: 'No code provided'
    });
  }
  
  const upperCode = code.toUpperCase().trim();
  
  if (VALID_CODES[upperCode]) {
    res.status(200).json({
      valid: true,
      product: VALID_CODES[upperCode]
    });
  } else {
    res.status(200).json({
      valid: false,
      message: 'Invalid code'
    });
  }
};