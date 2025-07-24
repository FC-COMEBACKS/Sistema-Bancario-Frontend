import React, { useEffect, useRef } from 'react';
import { Card, Button, Loader } from '../ui';
import { useUserDetails } from '../../shared/hooks';

const UserDetails = ({ userId, onEdit, showEditButton = true, userProfile: propUserProfile }) => {
    const { loading, error, userProfile: hookUserProfile, fetchCurrentUser } = useUserDetails();
    const hasCalledRef = useRef(false);
    
    const userProfile = propUserProfile || hookUserProfile;

    useEffect(() => {
        if (userId && !propUserProfile && !hasCalledRef.current) {
            hasCalledRef.current = true;
            fetchCurrentUser(userId);
        }
    }, [userId, propUserProfile, fetchCurrentUser]);

    useEffect(() => {
        hasCalledRef.current = false;
    }, [userId]);

    if (loading) {
        return (
            <Card>
                <div className="d-flex justify-content-center my-4">
                    <Loader />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="alert alert-danger">{error}</div>
            </Card>
        );
    }

    if (!userProfile) {
        return (
            <Card>
                <div className="text-center my-4">
                    <p>No se encontró información del usuario.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Detalles del Usuario</h4>
                {showEditButton && (
                    <Button variant="primary" onClick={onEdit}>
                        Editar Perfil
                    </Button>
                )}
            </div>

            <div className="row g-3">
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Nombre Completo</h6>
                        <p>{userProfile.nombre || 'No especificado'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Correo Electrónico</h6>
                        <p>{userProfile.email}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Usuario</h6>
                        <p>{userProfile.username || 'N/A'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Rol</h6>
                        <p>{userProfile.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">DPI</h6>
                        <p>{userProfile.dpi || 'No especificado'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Teléfono</h6>
                        <p>{userProfile.celular || 'No especificado'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Estado</h6>
                        <p>
                            <span className={`badge ${userProfile.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
                                {userProfile.estado || 'No especificado'}
                            </span>
                        </p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Trabajo</h6>
                        <p>{userProfile.nombreTrabajo || 'No especificado'}</p>
                    </div>
                </div>
                
                <div className="col-12">
                    <div className="mb-3">
                        <h6 className="fw-bold">Dirección</h6>
                        <p>{userProfile.direccion || 'No especificada'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Ingresos Mensuales</h6>
                        <p>{userProfile.ingresosMensuales ? `Q${userProfile.ingresosMensuales.toLocaleString()}` : 'No especificado'}</p>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="mb-3">
                        <h6 className="fw-bold">Fecha de Registro</h6>
                        <p>{userProfile.fechaRegistro ? new Date(userProfile.fechaRegistro).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default UserDetails;
