import React from 'react';
import { CuentaManagement } from '../../components';
import './CuentaPage.css';

const CuentaPage = () => {
    return (
        <div className="cuenta-page">
            <div className="page-header">
                <h1>Gestión de Cuentas Bancarias</h1>
                <p className="page-subtitle">Administra y supervisa todas las cuentas del sistema</p>
            </div>
            <CuentaManagement />
        </div>
    );
};

export default CuentaPage;
