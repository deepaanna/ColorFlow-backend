const crypto = require('crypto');

function generateUnlockToken() {
  return crypto.randomBytes(16).toString('hex');
}

const VALID_CODES = {
  'LAUNCH2024': 'premium',
  'FRIEND50': 'premium',
  'BETA': 'premium'
};

module.exports = {
  generateUnlockToken,
  VALID_CODES
};