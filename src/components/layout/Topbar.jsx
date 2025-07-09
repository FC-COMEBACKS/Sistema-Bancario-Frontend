import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/usuarios': return 'Usuarios';
    case '/mi-perfil': return 'Mi Perfil';
    case '/cuenta': return 'Cuentas';
    case '/movimiento': return 'Transferencias';
    case '/favorito': return 'Favoritos';
    case '/producto': return 'Productos';
    case '/settings': return 'Configuración';
    default: return 'Dashboard';
  }
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);
  
  const handleProfileClick = () => {
    navigate('/mi-perfil');
  };
  
  return (
    <div className="topbar">
      <h1 className="page-title">{pageTitle}</h1>
      <div className="user-profile">
        <div 
          className="user-avatar" 
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
          title="Ir a mi perfil"
        >
          U
        </div>
      </div>
    </div>
  );
};

export default Topbar;