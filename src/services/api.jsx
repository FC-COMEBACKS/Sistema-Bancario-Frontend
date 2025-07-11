import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/HRB/v1",
    timeout: 10000,
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
                console.error("Error parsing user token:", err);
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
        if (error.response && error.response.status === 401 && 
            !window.location.pathname.includes('/auth') &&
            error.response.data?.error?.includes('token') &&
            error.response.data?.error?.includes('expired')) {
            
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

export const getUserById = async (uid) => {
    try {
        return await api.get(`/users/${uid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getAllUsers = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.rol && filters.rol.trim()) queryParams.append('rol', filters.rol);
        if (filters.estado && filters.estado.trim()) queryParams.append('estado', filters.estado);
        if (filters.nombre && filters.nombre.trim()) queryParams.append('nombre', filters.nombre);
        if (filters.email && filters.email.trim()) queryParams.append('email', filters.email);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        const queryString = queryParams.toString();
        const url = queryString ? `/users?${queryString}` : '/users';
        
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const deleteUserAdmin = async (uid) => {
    try {
        return await api.delete(`/users/admin/${uid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const deleteUserClient = async (password) => {
    try {
        return await api.delete('/users/client', {
            data: { password }
        });
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const updatePassword = async (passwordData) => {
    try {
        return await api.patch('/users/password', passwordData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const updateUserAdmin = async (uid, userData) => {
    try {
        return await api.put(`/users/admin/${uid}`, userData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const updateUserClient = async (userData) => {
    try {
        return await api.put('/users/client', userData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getCuentas = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.limite) queryParams.append('limite', filters.limite);
        if (filters.pagina) queryParams.append('pagina', filters.pagina);
        if (filters.tipo) queryParams.append('tipo', filters.tipo);
        if (filters.activa !== undefined) queryParams.append('activa', filters.activa);
        
        const queryString = queryParams.toString();
        const url = queryString ? `/cuentas?${queryString}` : '/cuentas';
        
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const crearCuenta = async (cuentaData) => {
    try {
        const response = await api.post('/cuentas/crearCuenta', cuentaData);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const editarCuenta = async (cid, cuentaData) => {
    try {
        return await api.put(`/cuentas/editarCuenta/${cid}`, cuentaData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getDetallesCuenta = async (cid) => {
    try {
        return await api.get(`/cuentas/detallesCuenta/${cid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getCuentaById = async (cid) => {
    try {
        return await api.get(`/cuentas/${cid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getCuentaPorNumero = async (numeroCuenta) => {
    try {
        return await api.get(`/cuentas/numero/${numeroCuenta}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getCuentaByUsuario = async (uid) => {
    try {
        const response = await api.get(`/cuentas/cuentaUsuario/${uid}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const deleteCuenta = async (cid) => {
    try {
        const response = await api.delete(`/cuentas/eliminarCuenta/${cid}`);
        return response;
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};
