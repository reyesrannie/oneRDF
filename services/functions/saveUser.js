import CryptoJS from "crypto-js";

const saltkey = import.meta.env.VITE_SALT_KEY;

export const decodeUser = () => {
  let userDataDecrypt;
  if (sessionStorage.getItem("oneRDF")) {
    const userData = sessionStorage.getItem("oneRDF");
    const decipherText = CryptoJS.AES.decrypt(userData, saltkey);
    userDataDecrypt = JSON.parse(decipherText.toString(CryptoJS.enc.Utf8));
  }
  return userDataDecrypt;
};
