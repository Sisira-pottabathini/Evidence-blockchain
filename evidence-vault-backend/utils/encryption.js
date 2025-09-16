const CryptoJS = require('crypto-js');

// Encrypt data
const encrypt = (data, secretKey) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Decrypt data
const decrypt = (encryptedData, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Generate a random secret key
const generateSecretKey = () => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

module.exports = {
  encrypt,
  decrypt,
  generateSecretKey
};