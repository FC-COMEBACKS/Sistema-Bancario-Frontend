import React, { useState, useEffect } from 'react';
import { validatePassword } from '../../shared/validators';
import { Button, Card } from '../ui';
import { useUserDetails } from '../../shared/hooks';
import '../../pages/settings/settingsPage.css';

const ProfileForm = ({ onSuccess, initialData, initialTab = 'profile', showProfileTab = true }) => {
    const { loading, error, updateCurrentUser, changePassword } = useUserDetails();
    const [activeTab, setActiveTab] = useState(initialTab);
    
    const [profileData, setProfileData] = useState({
        nombre: '',
        celular: '',
        direccion: '',
        nombreTrabajo: '',
        ingresosMensuales: 0
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (initialData) {
            setProfileData({
                nombre: initialData.nombre || '',
                celular: initialData.celular || '',
                direccion: initialData.direccion || '',
                nombreTrabajo: initialData.nombreTrabajo || '',
                ingresosMensuales: initialData.ingresosMensuales || 0
            });
        }
    }, [initialData]);

    const validateProfileForm = () => {
        const errors = {};
        
        if (!profileData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }
        
        if (!profileData.celular.trim()) {
            errors.celular = 'El celular es requerido';
        } else if (!/^[0-9]{8}$/.test(profileData.celular)) {
            errors.celular = 'El celular debe tener exactamente 8 dígitos';
        }
        
        if (!profileData.direccion.trim()) {
            errors.direccion = 'La dirección es requerida';
        }
        
        if (!profileData.nombreTrabajo.trim()) {
            errors.nombreTrabajo = 'El trabajo es requerido';
        }
        
        if (!profileData.ingresosMensuales || profileData.ingresosMensuales < 100) {
            errors.ingresosMensuales = 'Los ingresos mensuales deben ser al menos Q100';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'La contraseña actual es requerida';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = 'La nueva contraseña es obligatoria';
        } else {
            const passwordValidation = validatePassword(passwordData.newPassword);
            if (passwordValidation !== true) {
                errors.newPassword = passwordValidation;
            }
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (!validateProfileForm()) return;
        
        try {
            const success = await updateCurrentUser(profileData);
            
            if (success) {
                setSuccessMessage('Perfil actualizado exitosamente');
                setFormErrors({}); 
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 1500); 
                }
            }
        } catch {
            setFormErrors({ general: 'Error inesperado al actualizar el perfil' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        
        if (!validatePasswordForm()) return;
        
        try {
            const success = await changePassword(passwordData);
            if (success) {
                setSuccessMessage('Contraseña actualizada exitosamente');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setFormErrors({});
            } else {
                setFormErrors({ general: 'Error al cambiar la contraseña' });
            }
        } catch (err) {
            if (err?.response?.data?.message) {
                setFormErrors({ general: err.response.data.message });
            } else if (err?.response?.data?.msg) {
                setFormErrors({ general: err.response.data.msg });
            } else {
                setFormErrors({ general: 'Error inesperado al cambiar la contraseña' });
            }
        }
    };

    return (
        <Card>
            {showProfileTab && (
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('profile')}
                        >
                            Información Personal
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('password')}
                        >
                            Cambiar Contraseña
                        </button>
                    </li>
                </ul>
            )}
            
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            {formErrors.general && <div className="alert alert-danger mb-3">{formErrors.general}</div>}
            {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}
            
            {showProfileTab && activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="nombre" className="form-label">Nombre*</label>
                            <input 
                                type="text" 
                                className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                                id="nombre"
                                name="nombre"
                                value={profileData.nombre}
                                onChange={handleProfileChange}
                                disabled={loading}
                            />
                            {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="celular" className="form-label">Celular*</label>
                            <input 
                                type="tel" 
                                className={`form-control ${formErrors.celular ? 'is-invalid' : ''}`}
                                id="celular"
                                name="celular"
                                value={profileData.celular}
                                onChange={handleProfileChange}
                                placeholder="48020284"
                                disabled={loading}
                            />
                            {formErrors.celular && <div className="invalid-feedback">{formErrors.celular}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="nombreTrabajo" className="form-label">Trabajo*</label>
                            <input 
                                type="text" 
                                className={`form-control ${formErrors.nombreTrabajo ? 'is-invalid' : ''}`}
                                id="nombreTrabajo"
                                name="nombreTrabajo"
                                value={profileData.nombreTrabajo}
                                onChange={handleProfileChange}
                                disabled={loading}
                            />
                            {formErrors.nombreTrabajo && <div className="invalid-feedback">{formErrors.nombreTrabajo}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="ingresosMensuales" className="form-label">Ingresos Mensuales*</label>
                            <input 
                                type="number" 
                                className={`form-control ${formErrors.ingresosMensuales ? 'is-invalid' : ''}`}
                                id="ingresosMensuales"
                                name="ingresosMensuales"
                                value={profileData.ingresosMensuales}
                                onChange={handleProfileChange}
                                min="100"
                                disabled={loading}
                            />
                            {formErrors.ingresosMensuales && <div className="invalid-feedback">{formErrors.ingresosMensuales}</div>}
                        </div>
                        
                        <div className="col-12">
                            <label htmlFor="direccion" className="form-label">Dirección*</label>
                            <textarea 
                                className={`form-control ${formErrors.direccion ? 'is-invalid' : ''}`}
                                id="direccion"
                                name="direccion"
                                value={profileData.direccion}
                                onChange={handleProfileChange}
                                rows="3"
                                disabled={loading}
                            />
                            {formErrors.direccion && <div className="invalid-feedback">{formErrors.direccion}</div>}
                        </div>
                        
                        <div className="col-12 d-flex justify-content-end mt-4">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
            
            {(activeTab === 'password' || !showProfileTab) && (
                <form onSubmit={handlePasswordSubmit}>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label htmlFor="currentPassword" className="form-label">Contraseña Actual*</label>
                            <input 
                                type="password" 
                                className={`form-control ${formErrors.currentPassword ? 'is-invalid' : ''}`}
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                disabled={loading}
                            />
                            {formErrors.currentPassword && <div className="invalid-feedback">{formErrors.currentPassword}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="newPassword" className="form-label">Nueva Contraseña*</label>
                            <input 
                                type="password" 
                                className={`form-control ${formErrors.newPassword ? 'is-invalid' : ''}`}
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                disabled={loading}
                            />
                            {formErrors.newPassword && <div className="invalid-feedback">{formErrors.newPassword}</div>}
                        </div>
                        
                        <div className="col-md-6">
                            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña*</label>
                            <input 
                                type="password" 
                                className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                disabled={loading}
                            />
                            {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                        </div>
                        
                        <div className="col-12 d-flex justify-content-end mt-4">
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Card>
    );
};

export default ProfileForm;
