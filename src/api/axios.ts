import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_PATH = import.meta.env.VITE_API_API_PATH || "";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL + API_PATH,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For session cookies
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = cookies.get("vote_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Or use your actual token
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          cookies.remove("token");
          // window.location.href = "/login";
          break;
        case 403:
          // Handle forbidden
          console.error("Forbidden access");
          break;
        case 404:
          // Handle not found
          console.error("Resource not found");
          break;
        case 500:
          // Handle server error
          console.error("Server error occurred");
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
