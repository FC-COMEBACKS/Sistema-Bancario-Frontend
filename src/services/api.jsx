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

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401 && !window.location.pathname.includes('/auth')) {
            console.warn('Sesión expirada o inválida');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export const register = async (data) => {
    try {
        return await api.post("/auth/register", data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}


export const login = async (data) => {
    try {
        return await api.post("/auth/login", data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

// ESTADISTICAS
export const getEstadisticasGenerales = async () => {
    try {
        return await api.get("/estadisticas/estadisticasgenerales");
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getMovimientosRecientes = async (limit = 10) => {
    try {
        return await api.get(`/estadisticas/movimientos/recientes?limit=${limit}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getEstadisticasMovimientos = async (periodo = 'mensual') => {
    try {
        return await api.get(`/estadisticas/movimientos?periodo=${periodo}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getEstadisticasUsuarios = async () => {
    try {
        return await api.get("/estadisticas/usuarios");
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getEstadisticasProductos = async () => {
    try {
        return await api.get("/estadisticas/productos");
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

