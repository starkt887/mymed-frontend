import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response.status;
    const message = error.response.data.message;
    if (
      (status === 401 || status === 403) &&
      (message === "Invalid token" ||
        message === "Access denied. No token provided")
    ) {
      localStorage.setItem("token", "");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
