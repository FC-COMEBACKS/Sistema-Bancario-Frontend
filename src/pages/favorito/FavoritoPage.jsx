import React from 'react';
import { FavoritosManagement } from '../../components/favorito/FavoritosManagement';
import '../../components/favorito/favoritos.css';
import './FavoritoPage.css';

const FavoritoPage = () => {
    return (
        <div className="favorito-page">
            <FavoritosManagement />
        </div>
    );
};

export default FavoritoPage;