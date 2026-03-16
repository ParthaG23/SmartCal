import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

/* ------------------------------------------------ */
/* attach token automatically                       */
/* ------------------------------------------------ */

API.interceptors.request.use((config) => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

/* ------------------------------------------------ */
/* calculators                                      */
/* ------------------------------------------------ */

export const getCalculators = () =>
  API.get("/calculators");

export const calculate = (type, data) =>
  API.post(`/calculators/${type}`, data);

/* ------------------------------------------------ */
/* authentication                                   */
/* ------------------------------------------------ */

export const registerUser = (data) =>
  API.post("/auth/signup", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

/* ------------------------------------------------ */
/* default export for direct axios instance use     */
/* ------------------------------------------------ */

export default API;   // ✅ this one line fixes Profile.jsx