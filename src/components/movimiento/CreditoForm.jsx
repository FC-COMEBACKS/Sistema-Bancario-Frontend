import React, { useState } from 'react';
import { useMovimiento } from '../../shared/hooks/useMovimiento';

const CreditoForm = ({ isOpen, onClose, onSuccess }) => {
    const { handleCredito, loading, error, success, clearMessages } = useMovimiento();
    const [monto, setMonto] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [descripcion, setDescripcion] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearMessages();
        const creditoData = {
            cuentaDestino: numeroCuenta,
            monto: parseFloat(monto),
            descripcion
        };
        const ok = await handleCredito(creditoData);
        if (ok && onSuccess) onSuccess();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                    <h3>Nuevo Crédito</h3>
                    <div>
                        <label>Monto:</label>
                        <input type="number" value={monto} onChange={e => setMonto(e.target.value)} required min="0.01" step="0.01" />
                    </div>
                    <div>
                        <label>Número de Cuenta:</label>
                        <input type="text" value={numeroCuenta} onChange={e => setNumeroCuenta(e.target.value)} required />
                    </div>
                    <div>
                        <label>Descripción:</label>
                        <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>Crédito realizado correctamente</div>}
                    <button type="submit" disabled={loading}>Realizar Crédito</button>
                </form>
            </div>
        </div>
    );
};

export default CreditoForm;
