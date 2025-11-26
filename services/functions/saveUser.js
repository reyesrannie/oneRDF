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

export const base64ToFile = (base64String, fileName) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};
