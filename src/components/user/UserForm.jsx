import React, { useState, useEffect } from 'react';
import { Button, Card } from '../ui';

const UserForm = ({ user, onSubmit, onCancel, isAdmin = false }) => {
    const [formData, setFormData] = useState({
        username: '',
        nombre: '',
        email: '',
        password: '',
        celular: '',
        direccion: '',
        dpi: '',
        nombreTrabajo: '',
        ingresosMensuales: 0,
        estado: 'ACTIVO',
        rol: 'CLIENT'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                nombre: user.nombre || '',
                email: user.email || '',
                password: '', 
                celular: user.celular || '',
                direccion: user.direccion || '',
                dpi: user.dpi || '',
                nombreTrabajo: user.nombreTrabajo || '',
                ingresosMensuales: user.ingresosMensuales || 0,
                estado: user.estado || 'ACTIVO',
                rol: user.rol || 'CLIENT'
            });
        } else {
            setFormData({
                username: '',
                nombre: '',
                email: '',
                password: '',
                celular: '',
                direccion: '',
                dpi: '',
                nombreTrabajo: '',
                ingresosMensuales: 0,
                estado: 'ACTIVO',
                rol: 'CLIENT'
            });
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!user && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida para usuarios nuevos';
        } else if (!user && formData.password.trim().length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.celular.trim()) {
            newErrors.celular = 'El celular es requerido';
        } else if (!/^[0-9]{8}$/.test(formData.celular)) {
            newErrors.celular = 'El celular debe tener exactamente 8 dígitos';
        }

        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        if (!formData.dpi.trim()) {
            newErrors.dpi = 'El DPI es requerido';
        }

        if (!formData.nombreTrabajo.trim()) {
            newErrors.nombreTrabajo = 'El trabajo es requerido';
        }

        if (!formData.ingresosMensuales || formData.ingresosMensuales < 100) {
            newErrors.ingresosMensuales = 'Los ingresos mensuales deben ser al menos Q100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        try {

            const dataToSubmit = { ...formData };

            if (user && !formData.password.trim()) {
                delete dataToSubmit.password;
            }
            
            await onSubmit(dataToSubmit);
        } catch (err) {
            err
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="username" className="form-label">Nombre de Usuario*</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Mínimo 3 caracteres"
                            disabled={isSubmitting}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <label htmlFor="nombre" className="form-label">Nombre*</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email*</label>
                        <input 
                            type="email" 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    {/* Campo de contraseña solo para usuarios nuevos */}
                    {!user && (
                        <div className="col-md-6">
                            <label htmlFor="password" className="form-label">Contraseña*</label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                disabled={isSubmitting}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                    )}
                    
                    <div className="col-md-6">
                        <label htmlFor="celular" className="form-label">Celular*</label>
                        <input 
                            type="tel" 
                            className={`form-control ${errors.celular ? 'is-invalid' : ''}`}
                            id="celular"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            placeholder="48020284"
                            disabled={isSubmitting}
                        />
                        {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <label htmlFor="dpi" className="form-label">DPI*</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.dpi ? 'is-invalid' : ''}`}
                            id="dpi"
                            name="dpi"
                            value={formData.dpi}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.dpi && <div className="invalid-feedback">{errors.dpi}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <label htmlFor="nombreTrabajo" className="form-label">Trabajo*</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.nombreTrabajo ? 'is-invalid' : ''}`}
                            id="nombreTrabajo"
                            name="nombreTrabajo"
                            value={formData.nombreTrabajo}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {errors.nombreTrabajo && <div className="invalid-feedback">{errors.nombreTrabajo}</div>}
                    </div>
                    
                    <div className="col-md-6">
                        <label htmlFor="ingresosMensuales" className="form-label">Ingresos Mensuales*</label>
                        <input 
                            type="number" 
                            className={`form-control ${errors.ingresosMensuales ? 'is-invalid' : ''}`}
                            id="ingresosMensuales"
                            name="ingresosMensuales"
                            value={formData.ingresosMensuales}
                            onChange={handleChange}
                            min="100"
                            disabled={isSubmitting}
                        />
                        {errors.ingresosMensuales && <div className="invalid-feedback">{errors.ingresosMensuales}</div>}
                    </div>
                    
                    <div className="col-12">
                        <label htmlFor="direccion" className="form-label">Dirección</label>
                        <textarea 
                            className="form-control"
                            id="direccion"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            rows="3"
                            disabled={isSubmitting}
                        />
                    </div>

                    {isAdmin && (
                        <>
                            <div className="col-md-6">
                                <label htmlFor="rol" className="form-label">Rol</label>
                                <select 
                                    className="form-select"
                                    id="rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="ADMIN">Administrador</option>
                                    <option value="CLIENT">Cliente</option>
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <label htmlFor="estado" className="form-label">Estado</label>
                                <select 
                                    className="form-select"
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </div>
                        </>
                    )}
                    
                    <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                        <Button 
                            variant="secondary" 
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : (user ? 'Actualizar' : 'Guardar')}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default UserForm;
