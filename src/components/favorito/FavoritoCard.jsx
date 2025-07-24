import React from 'react';

export const FavoritoCard = ({ favorito, onEdit, onDelete, onTransfer }) => {
    const { cuentaFavorita, alias, numeroCuenta, fechaCreacion } = favorito;
    
    return (
        <div className="favorito-card fade-in">
            <div className="favorito-header">
                <div className="favorito-info">
                    <h3>{alias}</h3>
                    <p>Cuenta de confianza</p>
                </div>
                <div className="favorito-badge">
                    Favorito
                </div>
            </div>
            
            <div className="favorito-details">
                <div className="detail-item">
                    <span className="detail-label cuenta">Número de Cuenta</span>
                    <span className="detail-value">{numeroCuenta}</span>
                </div>
                {cuentaFavorita && (
                    <>
                        <div className="detail-item">
                            <span className="detail-label tipo">Tipo de Cuenta</span>
                            <span className="detail-value">{cuentaFavorita.tipo}</span>
                        </div>
                        {cuentaFavorita.banco && (
                            <div className="detail-item">
                                <span className="detail-label banco">Banco</span>
                                <span className="detail-value">{cuentaFavorita.banco}</span>
                            </div>
                        )}
                    </>
                )}
                <div className="detail-item">
                    <span className="detail-label">Fecha de Agregado</span>
                    <span className="detail-value">{new Date(fechaCreacion).toLocaleDateString()}</span>
                </div>
            </div>
            
            <div className="favorito-actions">
                <button
                    className="btn-favorito primary"
                    onClick={() => onTransfer(favorito)}
                >
                    Transferir
                </button>
                <button
                    className="btn-favorito secondary"
                    onClick={() => onEdit(favorito)}
                >
                    Editar
                </button>
                <button
                    className="btn-favorito danger"
                    onClick={() => onDelete(favorito)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};