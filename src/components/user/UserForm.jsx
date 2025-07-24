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
        <div className="user-profile-container">
            {/* Header with gradient background */}
            <div className="profile-header">
                <div className="profile-header-content">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="avatar-badge editing">
                            <i className="fas fa-edit"></i>
                        </div>
                    </div>
                    <div className="profile-info">
                        <h2 className="profile-name">{formData.nombre || 'Editando Perfil'}</h2>
                        <p className="profile-role">
                            <i className="fas fa-edit me-2"></i>
                            Modo de Edición
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-cards-grid">
                        {/* Personal Information Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h5 className="card-title">
                                    <i className="fas fa-user-circle me-2"></i>
                                    Información Personal
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="nombre" className="form-label">
                                            <i className="fas fa-user me-2"></i>
                                            Nombre Completo *
                                        </label>
                                        <input 
                                            type="text" 
                                            className={`form-control modern-input ${errors.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            placeholder="Ingrese su nombre completo"
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            <i className="fas fa-at me-2"></i>
                                            Nombre de Usuario *
                                        </label>
                                        <input 
                                            type="text" 
                                            className={`form-control modern-input ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Mínimo 3 caracteres"
                                            disabled={isSubmitting}
                                        />
                                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            <i className="fas fa-envelope me-2"></i>
                                            Correo Electrónico *
                                        </label>
                                        <input 
                                            type="email" 
                                            className={`form-control modern-input ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            placeholder="ejemplo@correo.com"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    {!user && (
                                        <div className="form-group">
                                            <label htmlFor="password" className="form-label">
                                                <i className="fas fa-lock me-2"></i>
                                                Contraseña *
                                            </label>
                                            <input 
                                                type="password" 
                                                className={`form-control modern-input ${errors.password ? 'is-invalid' : ''}`}
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

                                    <div className="form-group">
                                        <label htmlFor="dpi" className="form-label">
                                            <i className="fas fa-id-card me-2"></i>
                                            DPI *
                                        </label>
                                        <input 
                                            type="text" 
                                            className={`form-control modern-input ${errors.dpi ? 'is-invalid' : ''}`}
                                            id="dpi"
                                            name="dpi"
                                            value={formData.dpi}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            placeholder="1234567890123"
                                        />
                                        {errors.dpi && <div className="invalid-feedback">{errors.dpi}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="celular" className="form-label">
                                            <i className="fas fa-phone me-2"></i>
                                            Teléfono *
                                        </label>
                                        <input 
                                            type="tel" 
                                            className={`form-control modern-input ${errors.celular ? 'is-invalid' : ''}`}
                                            id="celular"
                                            name="celular"
                                            value={formData.celular}
                                            onChange={handleChange}
                                            placeholder="48020284"
                                            disabled={isSubmitting}
                                        />
                                        {errors.celular && <div className="invalid-feedback">{errors.celular}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Work Information Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h5 className="card-title">
                                    <i className="fas fa-briefcase me-2"></i>
                                    Información Laboral
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="nombreTrabajo" className="form-label">
                                            <i className="fas fa-building me-2"></i>
                                            Trabajo *
                                        </label>
                                        <input 
                                            type="text" 
                                            className={`form-control modern-input ${errors.nombreTrabajo ? 'is-invalid' : ''}`}
                                            id="nombreTrabajo"
                                            name="nombreTrabajo"
                                            value={formData.nombreTrabajo}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            placeholder="Ingrese su trabajo actual"
                                        />
                                        {errors.nombreTrabajo && <div className="invalid-feedback">{errors.nombreTrabajo}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="ingresosMensuales" className="form-label">
                                            <i className="fas fa-dollar-sign me-2"></i>
                                            Ingresos Mensuales *
                                        </label>
                                        <input 
                                            type="number" 
                                            className={`form-control modern-input ${errors.ingresosMensuales ? 'is-invalid' : ''}`}
                                            id="ingresosMensuales"
                                            name="ingresosMensuales"
                                            value={formData.ingresosMensuales}
                                            onChange={handleChange}
                                            min="100"
                                            disabled={isSubmitting}
                                            placeholder="0"
                                        />
                                        {errors.ingresosMensuales && <div className="invalid-feedback">{errors.ingresosMensuales}</div>}
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="direccion" className="form-label">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            Dirección
                                        </label>
                                        <textarea 
                                            className={`form-control modern-input ${errors.direccion ? 'is-invalid' : ''}`}
                                            id="direccion"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            rows="3"
                                            disabled={isSubmitting}
                                            placeholder="Ingrese su dirección completa"
                                        />
                                        {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Settings Card */}
                        {isAdmin && (
                            <div className="profile-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-cog me-2"></i>
                                        Configuración de Cuenta
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="rol" className="form-label">
                                                <i className="fas fa-user-tag me-2"></i>
                                                Rol
                                            </label>
                                            <select 
                                                className="form-control modern-input"
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

                                        <div className="form-group">
                                            <label htmlFor="estado" className="form-label">
                                                <i className="fas fa-toggle-on me-2"></i>
                                                Estado
                                            </label>
                                            <select 
                                                className="form-control modern-input"
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button 
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="cancel-btn-modern"
                        >
                            <i className="fas fa-times"></i>
                            <span>Cancelar</span>
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="save-btn-modern"
                        >
                            <i className="fas fa-save"></i>
                            <span>{isSubmitting ? 'Guardando...' : (user ? 'Actualizar' : 'Guardar')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
