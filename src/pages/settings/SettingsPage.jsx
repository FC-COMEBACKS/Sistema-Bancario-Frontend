import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

const SettingsPage = () => {
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/perfil');
    };

    const handleChangePassword = () => {
        navigate('/cambiar-password');
    };

    return (
        <div className="settings-page fade-in">
            <div className="settings-header">
                <h1>Configuración del Sistema</h1>
                <p>Administra tu cuenta, seguridad y preferencias personales desde un panel de control completo</p>
            </div>

            <div className="settings-content">
                <div className="settings-grid">
                    <div className="setting-card slide-up">
                        <div className="setting-item">
                            <div className="setting-icon profile">
                                <span>👤</span>
                            </div>
                            <div className="setting-info">
                                <h3>Perfil de Usuario</h3>
                                <p>Actualiza tu información personal, nombre, email y otros datos importantes de tu perfil</p>
                                <div className="setting-features">
                                    <span className="feature-tag">Información Personal</span>
                                    <span className="feature-tag">Contacto</span>
                                </div>
                            </div>
                            <div className="setting-action">
                                <button className="setting-button primary" onClick={handleEditProfile}>
                                    ✏️ Editar Perfil
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="setting-card slide-up">
                        <div className="setting-item">
                            <div className="setting-icon security">
                                <span>🔒</span>
                            </div>
                            <div className="setting-info">
                                <h3>Seguridad</h3>
                                <p>Cambia tu contraseña y configura medidas de seguridad para mantener tu cuenta protegida</p>
                                <div className="setting-features">
                                    <span className="feature-tag">Contraseña</span>
                                    <span className="feature-tag">Autenticación</span>
                                </div>
                            </div>
                            <div className="setting-action">
                                <button className="setting-button secondary" onClick={handleChangePassword}>
                                    🔑 Cambiar Contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
