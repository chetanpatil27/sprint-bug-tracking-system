import axios from "axios";

export const axiosInstance = axios.create({});
export const API_HOST = "http://localhost:3000/api/";

// Interceptor to always get the latest host from localStorage
axiosInstance.interceptors.request.use((config) => {
    config.baseURL = API_HOST;
    return config;
});
