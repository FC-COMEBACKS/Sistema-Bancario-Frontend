import React, { useState, useEffect } from 'react';
import { FavoritoList } from './FavoritoList';
import { FavoritoForm } from './FavoritoForm';
import { QuickTransferForm } from './QuickTransferForm';
import { useFavoritoManagement } from '../../shared/hooks/useFavoritoManagement';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './favoritos.css';

export const FavoritosManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [editingFavorito, setEditingFavorito] = useState(null);
    const [transferFavorito, setTransferFavorito] = useState(null);

    const {
        favoritos,
        cargarFavoritos,
        loading,
        error,
        setError,
        success,
        setSuccess,
        agregarNuevoFavorito,
        actualizarFavorito,
        eliminarFavorito,
        transferirAContacto
    } = useFavoritoManagement();

    useEffect(() => {
        cargarFavoritos();
    }, []);

    const handleAgregarFavorito = () => {
        setEditingFavorito(null);
        setShowForm(true);
    };

    const handleEditarFavorito = (favorito) => {
        setEditingFavorito(favorito);
        setShowForm(true);
    };

    const handleEliminarFavorito = async (favorito) => {
        if (window.confirm(`¿Estás seguro de eliminar "${favorito.alias}" de tus favoritos?`)) {
            await eliminarFavorito(favorito._id);
        }
    };

    const handleTransferirFavorito = (favorito) => {
        setTransferFavorito(favorito);
        setShowTransferForm(true);
    };

    const handleSubmitForm = async (formData) => {
        if (editingFavorito) {
            await actualizarFavorito(editingFavorito._id, formData.alias);
        } else {
            await agregarNuevoFavorito(formData.numeroCuenta, formData.alias);
        }
        
        if (!error) {
            setShowForm(false);
            setEditingFavorito(null);
        }
    };

    const handleTransferSubmit = async (transferData) => {
        const result = await transferirAContacto(
            transferData.favoritoId,
            transferData.monto,
            transferData.descripcion
        );
        
        if (result && !error) {
            setShowTransferForm(false);
            setTransferFavorito(null);
        }
    };

    return (
        <div className="favoritos-management">
            <Card className="favoritos-header">
                <div className="header-content">
                    <div className="header-info">
                        <h2>Mis Favoritos</h2>
                        <p>Gestiona tus cuentas favoritas para transferencias rápidas</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleAgregarFavorito}
                        className="add-favorito-btn"
                    >
                        ⭐ Agregar Favorito
                    </Button>
                </div>
            </Card>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="alert-close">×</button>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="alert-close">×</button>
                </div>
            )}

            <FavoritoList
                favoritos={favoritos}
                loading={loading}
                onEdit={handleEditarFavorito}
                onDelete={handleEliminarFavorito}
                onTransfer={handleTransferirFavorito}
            />

            <FavoritoForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingFavorito(null);
                }}
                onSubmit={handleSubmitForm}
                loading={loading}
                editingFavorito={editingFavorito}
            />

            <QuickTransferForm
                isOpen={showTransferForm}
                onClose={() => {
                    setShowTransferForm(false);
                    setTransferFavorito(null);
                }}
                favorito={transferFavorito}
                onTransfer={handleTransferSubmit}
                loading={loading}
            />
        </div>
    );
};