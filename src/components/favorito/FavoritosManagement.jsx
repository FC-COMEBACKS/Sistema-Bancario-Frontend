import React, { useState, useEffect } from 'react';
import { FavoritoList } from './FavoritoList';
import { FavoritoForm } from './FavoritoForm';
import { QuickTransferForm } from './QuickTransferForm';
import { useFavorito } from '../../shared/hooks/useFavorito';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './favoritos.css';

export const FavoritosManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [showTransferForm, setShowTransferForm] = useState(false);
    const [editingFavorito, setEditingFavorito] = useState(null);
    const [transferFavorito, setTransferFavorito] = useState(null);
    const [success, setSuccess] = useState('');

    const {
        favoritos,
        cargarFavoritos,
        agregarAFavoritos,
        actualizarAlias,
        eliminarDeFavoritos,
        loading,
        error,
        setError,
        transferirRapido
    } = useFavorito();

    useEffect(() => {
        cargarFavoritos();
    }, []); 

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error, setError]);

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
            await eliminarDeFavoritos(favorito.fid || favorito._id);
        }
    };

    const handleTransferirFavorito = (favorito) => {
        setTransferFavorito(favorito);
        setShowTransferForm(true);
    };

    const handleSubmitForm = async (formData) => {
        if (editingFavorito) {
            const success = await actualizarAlias(editingFavorito.fid || editingFavorito._id, formData.alias);
            if (success) {
                setSuccess('Favorito actualizado correctamente');
                setShowForm(false);
                setEditingFavorito(null);
            }
        } else {
            const success = await agregarAFavoritos(formData.numeroCuenta, formData.alias);
            if (success) {
                setSuccess('Favorito agregado correctamente');
                setShowForm(false);
                setEditingFavorito(null);
            }
        }
    };

    const handleTransferSubmit = async (transferData) => {
        const result = await transferirRapido(
            transferData.favoritoId,
            transferData.monto,
            transferData.descripcion
        );
        
        if (result && !error) {
            setSuccess('Transferencia realizada correctamente');
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