const CryptoJS = require("crypto-js");

// Replace this key with your secret encryption key (must be the same for encryption and decryption).
const secretKey = process.env.NEXT_PUBLIC_ENC_KEY;

// Encryption function
function encrypt(data) {
 // Generate a random IV.
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt the text with the key and IV.
  const ciphertext = CryptoJS.AES.encrypt(data, secretKey, {iv});

  // Return the ciphertext in base64 format.
	return {
		hash: ciphertext.toString(),
		iv
	};
}

module.exports = encrypt;