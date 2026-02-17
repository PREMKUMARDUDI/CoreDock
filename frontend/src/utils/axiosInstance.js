import axios from "axios";

// We export this to use in all API calls
export const clientServer = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor to automatically add the Token to every request
clientServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
