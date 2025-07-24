import React from 'react';
import { FavoritoCard } from './FavoritoCard';
import Loader from '../ui/Loader';

export const FavoritoList = ({ 
    favoritos, 
    loading, 
    onEdit, 
    onDelete, 
    onTransfer,
    emptyMessage = "No tienes favoritos agregados" 
}) => {
    if (loading) {
        return (
            <div className="favoritos-loading">
                <div className="loading-spinner"></div>
                <p>Cargando favoritos...</p>
            </div>
        );
    }

    if (!favoritos || favoritos.length === 0) {
        return (
            <div className="favoritos-empty">
                <div className="empty-icon">⭐</div>
                <h3>Sin favoritos</h3>
                <p>{emptyMessage}</p>
                <button className="empty-action">
                    Agregar tu primer favorito
                </button>
            </div>
        );
    }

    return (
        <div className="favoritos-list slide-up">
            <div className="favoritos-grid">
                {favoritos.map((favorito) => (
                    <FavoritoCard
                        key={favorito.fid || favorito._id}
                        favorito={favorito}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTransfer={onTransfer}
                    />
                ))}
            </div>
        </div>
    );
};