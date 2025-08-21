import axios from "axios";

// Detect environment based on URL rather than env variables
const isDevelopment = window.location.hostname === "localhost";

const axiosInstance = axios.create({
  baseURL: isDevelopment ? "http://localhost:5050/api" : "/api",
  withCredentials: true,
});

export default axiosInstance;
