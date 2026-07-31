import axios from "axios";



// Usa la variable de entorno de Vite o cae de vuelta a localhost si estás en local

const API_BASE_URL = import.meta.env.VITE_API_URL

    ? `${import.meta.env.VITE_API_URL}/api`

    : "http://localhost:3000/api"; // O el puerto que uses localmente



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

