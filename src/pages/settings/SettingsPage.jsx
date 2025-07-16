import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
import './settingsPage.css';

const SettingsPage = () => {
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/perfil');
    };

    const handleChangePassword = () => {
        navigate('/cambiar-password');
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Configuración</h1>
                <p>Administra tu cuenta y configuraciones</p>
            </div>

            <div className="settings-content">
                <div className="settings-grid">
                    <Card>
                        <div className="setting-item">
                            <div className="setting-icon">
                                <span>👤</span>
                            </div>
                            <div className="setting-info">
                                <h3>Perfil de Usuario</h3>
                                <p>Actualiza tu información personal, nombre, email y otros datos</p>
                            </div>
                            <div className="setting-action">
                                <Button onClick={handleEditProfile}>
                                    Editar Perfil
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="setting-item">
                            <div className="setting-icon">
                                <span>🔒</span>
                            </div>
                            <div className="setting-info">
                                <h3>Seguridad</h3>
                                <p>Cambia tu contraseña para mantener tu cuenta segura</p>
                            </div>
                            <div className="setting-action">
                                <Button onClick={handleChangePassword}>
                                    Cambiar Contraseña
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
