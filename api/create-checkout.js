const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS Headers - MUST BE FIRST
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product = 'premium' } = req.body || {};
    
    const products = {
      premium: {
        name: 'Color Flow Premium - Lifetime',
        amount: 499, // $4.99 in cents
        description: 'Remove ads, unlimited hints, all themes'
      },
      hints: {
        name: '50 Hint Pack',
        amount: 99, // $0.99
        description: 'Get 50 hints to use anytime'
      }
    };

    const selectedProduct = products[product] || products.premium;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: selectedProduct.name,
            description: selectedProduct.description,
          },
          unit_amount: selectedProduct.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://github.com/deepaanna'}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.headers.origin || 'https://github.com/deepaanna',
    });

    res.status(200).json({ 
      id: session.id,
      url: session.url 
    });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: err.message 
    });
  }
};