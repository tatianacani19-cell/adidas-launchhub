import axios from "axios";

// Limpiamos barras al final si existen en la variable de entorno
const rawUrl = import.meta.env.VITE_API_URL || "";
const cleanUrl = rawUrl.replace(/\/+$/, "");

const API_BASE_URL = cleanUrl
    ? `${cleanUrl}/api`
    : "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;