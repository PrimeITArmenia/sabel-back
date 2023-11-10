const CryptoJS = require("crypto-js");

const secretKey = process.env.NEXT_PUBLIC_ENC_KEY;

function decrypt(ciphertext, iv) {
  // Convert the ciphertext from base64 to a WordArray.
  const ciphertextWordArray = CryptoJS.enc.Base64.parse(ciphertext);

  // Decrypt the ciphertext with the key and IV.
  const plaintext = CryptoJS.AES.decrypt(ciphertextWordArray, secretKey, {iv});

  // Return the plaintext as a string.
  return plaintext.toString(CryptoJS.enc.Utf8);
}

module.exports = decrypt;