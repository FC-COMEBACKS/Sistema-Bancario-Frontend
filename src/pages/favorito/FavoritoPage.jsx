import React from 'react';
import { FavoritosManagement } from '../../components/favorito/FavoritosManagement';
import '../../components/favorito/Favoritos.css';

const FavoritoPage = () => {
    return (
        <div className="favorito-page">
            <FavoritosManagement />
        </div>
    );
};

export default FavoritoPage;