import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export const getCalculators = () => API.get("/calculators");

export const calculate = (type, data) =>
  API.post(`/calculators/${type}`, data);