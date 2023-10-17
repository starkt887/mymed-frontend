import CryptoJS from "crypto-js";

const encryptCrypto = (text) =>
  CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));

const decryptCrypto = (data) =>
  CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);

export { encryptCrypto, decryptCrypto };
