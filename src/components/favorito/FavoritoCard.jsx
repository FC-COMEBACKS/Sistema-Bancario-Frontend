import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

export const FavoritoCard = ({ favorito, onEdit, onDelete, onTransfer }) => {
    const { cuentaFavorita, alias, numeroCuenta, fechaCreacion } = favorito;
    
    return (
        <Card className="favorito-card">
            <div className="favorito-header">
                <div className="favorito-info">
                    <h3 className="favorito-alias">{alias}</h3>
                    <p className="favorito-numero">Cuenta: {numeroCuenta}</p>
                    {cuentaFavorita && (
                        <p className="favorito-tipo">Tipo: {cuentaFavorita.tipo}</p>
                    )}
                </div>
                <div className="favorito-badge">
                    ⭐ Favorito
                </div>
            </div>
            
            <div className="favorito-details">
                <p className="favorito-fecha">
                    Agregado: {new Date(fechaCreacion).toLocaleDateString()}
                </p>
            </div>
            
            <div className="favorito-actions">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onTransfer(favorito)}
                    className="transfer-btn"
                >
                    💸 Transferir
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(favorito)}
                    className="edit-btn"
                >
                    ✏️ Editar
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(favorito)}
                    className="delete-btn"
                >
                    🗑️ Eliminar
                </Button>
            </div>
        </Card>
    );
};