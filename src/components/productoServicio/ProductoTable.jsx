import React from 'react';
import { Table, Button } from '../ui';
import { EditButton, DeleteButton } from '../';
import '../movimiento/MovimientoModals.css';

const ProductoTable = ({ 
    productos = [], 
    onEdit, 
    onDelete, 
    onToggleEstado,
    loading = false,
    isAdmin = false 
}) => {
    const columns = [
        {
            key: 'nombre',
            field: 'nombre',
            header: 'Nombre',
            render: (producto) => (
                <div>
                    <strong>{producto.nombre}</strong>
                </div>
            )
        },
        {
            key: 'descripcion',
            field: 'descripcion',
            header: 'Descripción',
            render: (producto) => (
                <div className="descripcion-cell">
                    {producto.descripcion || 'Sin descripción'}
                </div>
            )
        },
        {
            key: 'precio',
            field: 'precio',
            header: 'Precio',
            render: (producto) => (
                <div>
                    <strong>${producto.precio}</strong>
                </div>
            )
        },
        {
            key: 'disponible',
            field: 'disponible',
            header: 'Estado',
            render: (producto) => (
                <span className={`estado-badge ${producto.disponible ? 'disponible' : 'no-disponible'}`}>
                    {producto.disponible ? 'Disponible' : 'No disponible'}
                </span>
            )
        }
    ];

    if (isAdmin) {
        columns.push({
            key: 'acciones',
            field: 'acciones',
            header: 'Acciones',
            render: (producto) => (
                <div className="table-actions">
                    <EditButton onClick={() => onEdit(producto)} />
                    <DeleteButton onClick={() => onDelete(producto.id || producto.pid)} />
                    <Button
                        className={producto.disponible ? "btn-warning" : "btn-success"}
                        onClick={() => onToggleEstado(producto.id || producto.pid)}
                    >
                        {producto.disponible ? 'Desactivar' : 'Activar'}
                    </Button>
                </div>
            )
        });
    }

    return (
        <div className="producto-table">
            <Table
                data={productos}
                columns={columns}
                isLoading={loading}
                emptyMessage="No se encontraron productos"
            />
        </div>
    );
};

export default ProductoTable;
