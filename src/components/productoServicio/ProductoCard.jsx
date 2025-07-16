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
    return (
        <Card className="producto-card">
            <div className="producto-header">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <div className="producto-estado">
                    <span className={`estado-badge ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                        {producto.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
            </div>
            
            <div className="producto-body">
                <p className="producto-descripcion">{producto.descripcion}</p>
                
                <div className="producto-info">
                    <div className="info-item">
                        <span className="label">Precio:</span>
                        <span className="value precio">Q{producto.precio}</span>
                    </div>
                    {producto.stock !== undefined && (
                        <div className="info-item">
                            <span className="label">Stock:</span>
                            <span className={`value stock ${producto.stock <= (producto.stockMinimo || 5) ? 'stock-bajo' : producto.stock === 0 ? 'sin-stock' : ''}`}>
                                {producto.stock} unidades
                                {producto.stock <= (producto.stockMinimo || 5) && producto.stock > 0 && (
                                    <span className="stock-warning"> (Bajo)</span>
                                )}
                                {producto.stock === 0 && (
                                    <span className="sin-stock-text"> (Agotado)</span>
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="producto-actions">
                {isAdmin ? (
                    <>
                        <EditButton onClick={() => onEdit(producto)} />
                        <DeleteButton onClick={() => onDelete(producto.id || producto.pid)} />
                        <Button
                            variant={producto.disponible ? "outline" : "primary"}
                            size="sm"
                            onClick={() => onToggleEstado(producto.id || producto.pid)}
                        >
                            {producto.disponible ? 'Desactivar' : 'Activar'}
                        </Button>
                    </>
                ) : (
                    <>
                        {producto.disponible && producto.stock !== 0 && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onComprar(producto)}
                            >
                                Comprar
                            </Button>
                        )}
                        {producto.stock === 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled
                            >
                                Sin Stock
                            </Button>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};

export default ProductoCard;
