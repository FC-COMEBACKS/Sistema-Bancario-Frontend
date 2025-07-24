import React from 'react';
import { Card, Button } from '../ui';
import { EditButton, DeleteButton } from '../';

const ProductoCard = ({ 
    producto, 
    onEdit, 
    onDelete, 
    onToggleEstado, 
    onComprar, 
    isAdmin = false 
}) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
            minimumFractionDigits: 2
        }).format(price);
    };

    const getStockStatus = () => {
        if (producto.stock === 0) return 'sin-stock';
        if (producto.stock <= (producto.stockMinimo || 5)) return 'stock-bajo';
        return 'stock-normal';
    };

    const getStockIcon = () => {
        const status = getStockStatus();
        switch(status) {
            case 'sin-stock': return '❌';
            case 'stock-bajo': return '⚠️';
            default: return '✅';
        }
    };

    return (
        <Card className="producto-card">
            <div className="producto-header">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <div className="producto-estado">
                    <span className={`estado-badge ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                        {producto.disponible ? '🟢 Disponible' : '🔴 No disponible'}
                    </span>
                </div>
            </div>
            
            <div className="producto-body">
                <p className="producto-descripcion">{producto.descripcion}</p>
                
                <div className="producto-info">
                    <div className="info-item">
                        <span className="label">💰 Precio:</span>
                        <span className="value precio">{formatPrice(producto.precio)}</span>
                    </div>
                    {producto.stock !== undefined && (
                        <div className="info-item">
                            <span className="label">{getStockIcon()} Stock:</span>
                            <span className={`value stock ${getStockStatus()}`}>
                                {producto.stock} unidades
                                {producto.stock <= (producto.stockMinimo || 5) && producto.stock > 0 && (
                                    <span className="stock-warning">¡Poco stock!</span>
                                )}
                                {producto.stock === 0 && (
                                    <span className="sin-stock-text">Agotado</span>
                                )}
                            </span>
                        </div>
                    )}
                    {producto.categoria && (
                        <div className="info-item">
                            <span className="label">🏷️ Categoría:</span>
                            <span className="value">{producto.categoria}</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="producto-actions">
                {isAdmin ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(producto)}
                            className="btn-edit"
                        >
                            ✏️ Editar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(producto.id || producto.pid)}
                            className="btn-delete"
                        >
                            🗑️ Eliminar
                        </Button>
                        <Button
                            variant={producto.disponible ? "outline" : "primary"}
                            size="sm"
                            onClick={() => onToggleEstado(producto.id || producto.pid)}
                            className="btn-toggle-estado"
                        >
                            {producto.disponible ? '🔒 Desactivar' : '🔓 Activar'}
                        </Button>
                    </>
                ) : (
                    <>
                        {producto.disponible && producto.stock !== 0 ? (
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => onComprar(producto)}
                                className="btn-comprar"
                            >
                                🛒 Comprar Ahora
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="btn-disabled"
                            >
                                {producto.stock === 0 ? '❌ Sin Stock' : '🔒 No Disponible'}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="btn-details"
                        >
                            👁️ Ver Detalles
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};

export default ProductoCard;
