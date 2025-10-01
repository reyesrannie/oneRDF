import CryptoJS from "crypto-js";

const loginService = () => {
  const saltkey = import.meta.env.VITE_SALT_KEY;

  const loginUser = (data, password) => {
    const userData = CryptoJS.AES.encrypt(
      JSON.stringify({ ...data, password: password }),
      saltkey
    ).toString();
    sessionStorage.setItem("oneRDF", userData);
  };

  return { loginUser };
};

export const { loginUser } = loginService();
