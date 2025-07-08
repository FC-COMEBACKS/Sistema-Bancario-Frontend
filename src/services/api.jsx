import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/HRB/v1",
    timeout: 3000,
    httpsAgent: false
})

api.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                    // console.log("Token agregado al header:", parsedUser.token);
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el error es 401 (no autorizado) y no estamos en login, limpiar localStorage y redirigir
        if (error.response && error.response.status === 401 && !window.location.pathname.includes('/auth')) {
            console.warn('Sesión expirada o inválida');
            localStorage.removeItem('user');
            // Redirigir a login si no estamos ya en login
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    try {
        console.log('Enviando datos de registro:', data);
        const response = await api.post("/auth/register", data);
        console.log('Respuesta de registro:', response.data);
        return {
            error: false,
            data: response.data
        };
    } catch (err) {
        console.error('Error en registro:', err.response?.data || err);
        return {
            error: true,
            message: err.response?.data?.message || "Error al registrar usuario",
            err
        };
    }
};


export const login = async (data) => {
    try {
        const response = await api.post("/auth/login", data);
        return {
            error: false,
            data: response.data
        };
    } catch (err) {
        return {
            error: true,
            message: err.response?.data?.message || "Error al iniciar sesión",
            err
        };
    }
};

// Exportamos también la instancia de api para uso directo si es necesario
export { api };