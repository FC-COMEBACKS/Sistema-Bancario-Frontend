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

export const listarCuentasAgregadas = async () => {
    try {
        return await api.get('/cuentas/listarCuentasAgregadas');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const agregarCuentaDeUsuario = async (cuentaData) => {
    try {
        return await api.post('/cuentas/agregarCuentaDeUsuario', cuentaData);
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

export const getAllMovimientos = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.limite) queryParams.append("limite", filters.limite);
        if (filters.pagina) queryParams.append("pagina", filters.pagina);
        if (filters.tipo) queryParams.append("tipo", filters.tipo);
        if (filters.fechaDesde) queryParams.append("fechaDesde", filters.fechaDesde);
        if (filters.fechaHasta) queryParams.append("fechaHasta", filters.fechaHasta);
        if (filters.montoMinimo) queryParams.append("montoMinimo", filters.montoMinimo);
        if (filters.montoMaximo) queryParams.append("montoMaximo", filters.montoMaximo);
        if (filters.usuario) queryParams.append("usuario", filters.usuario);

        const queryString = queryParams.toString();
        const url = queryString ? `/movimientos?${queryString}` : "/movimientos";
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const realizarTransferencia = async (transferenciaData) => {
    try {
        return await api.post('/movimientos/transferencia', transferenciaData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const realizarDeposito = async (depositoData) => {
    try {
        return await api.post('/movimientos/deposito', depositoData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const revertirDeposito = async (movimientoId) => {
    try {
        return await api.post(`/movimientos/deposito/${movimientoId}/revertir`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const realizarCredito = async (creditoData) => {
    try {
        return await api.post('/movimientos/credito', creditoData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const comprarProducto = async (compraData) => {
    try {
        return await api.post('/movimientos/realizar-compra', compraData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getHistorialCuenta = async (cuentaId) => {
    try {
        return await api.get(`/movimientos/cuenta/${cuentaId}`);
    } catch (err) {
        return {
            error: true,
            err
        };
    }
};

export const getMovimientoById = async (movimientoId) => {
    try {
        return await api.get(`/movimientos/${movimientoId}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getAllProductos = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.nombre && filters.nombre.trim()) {
            queryParams.append('nombre', filters.nombre.trim());
        }
        if (filters.disponible !== undefined && filters.disponible !== '') {
            queryParams.append('disponible', filters.disponible);
        }
        if (filters.precioMin && filters.precioMin.toString().trim() !== '' && !isNaN(filters.precioMin) && parseFloat(filters.precioMin) >= 0) {
            queryParams.append('precioMin', filters.precioMin);
        }
        if (filters.precioMax && filters.precioMax.toString().trim() !== '' && !isNaN(filters.precioMax) && parseFloat(filters.precioMax) >= 0) {
            queryParams.append('precioMax', filters.precioMax);
        }
        if (filters.page && filters.page > 0) {
            queryParams.append('page', filters.page);
        }
        if (filters.limit && filters.limit > 0) {
            queryParams.append('limit', filters.limit);
        }
        if (filters.desde && filters.desde >= 0) {
            queryParams.append('desde', filters.desde);
        }
        
        const queryString = queryParams.toString();
        const url = queryString ? `/productosOServicios/listarProductoOServicio?${queryString}` : '/productosOServicios/listarProductoOServicio';
        
        return await api.get(url);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getProductoById = async (pid) => {
    try {
        return await api.get(`/productosOServicios/listarProductoOServicio/${pid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const crearProducto = async (productoData) => {
    try {
        return await api.post('/productosOServicios/agregarProductoOServicio', productoData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const editarProducto = async (pid, productoData) => {
    try {
        return await api.put(`/productosOServicios/actualizarProductoOServicio/${pid}`, productoData);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const eliminarProducto = async (pid) => {
    try {
        return await api.delete(`/productosOServicios/eliminarProductoOServicio/${pid}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const cambiarEstadoProducto = async (pid, disponible) => {
    try {
        return await api.patch(`/productosOServicios/disponibilidad/${pid}`, { disponible });
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getEstadisticasProductosServicios = async () => {
    try {
        return await api.get('/productosOServicios/estadisticas');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getDivisas = async (filtro = '') => {
    try {
        const params = filtro ? { filtro } : {};
        return await api.get('/divisas', { params });
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const convertirMonto = async (data) => {
    try {
        return await api.post('/divisas/convertir', data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const convertirSaldoCuenta = async (data) => {
    try {
        return await api.post('/divisas/convertir-saldo', data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const actualizarTasasDivisa = async (tasas) => {
    try {
        return await api.post('/divisas/actualizar-tasas', { tasas });
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const agregarDivisa = async (data) => {
    try {
        return await api.post('/divisas/agregar', data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const restaurarTasasOficiales = async () => {
    try {
        return await api.post('/divisas/restaurar-tasas-oficiales');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const getFavoritos = async () => {
    try {
        return await api.get('/favoritos');
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const agregarFavorito = async (data) => {
    try {
        return await api.post('/favoritos/agregarCuenta', data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const updateFavorito = async (id, data) => {
    try {
        return await api.put(`/favoritos/${id}`, data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const deleteFavorito = async (id) => {
    try {
        return await api.delete(`/favoritos/${id}`);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};

export const transferirAFavorito = async (data) => {
    try {
        return await api.post('/favoritos/transferir', data);
    } catch (err) {
        return {
            error: true,
            err
        }
    }
};