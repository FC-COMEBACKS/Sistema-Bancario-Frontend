import React from 'react';
import TransferForm from '../../components/movimiento/TransferForm';
import './transferPage.css';

const TransferPage = () => {
    return (
        <div className="transfer-page">
            <div className="transfer-header">
                <h1>Realizar Transferencia</h1>
                <p>Transfiere dinero entre cuentas de forma segura</p>
            </div>

            <div className="transfer-content">
                <TransferForm />
            </div>
        </div>
    );
};

export default TransferPage;
