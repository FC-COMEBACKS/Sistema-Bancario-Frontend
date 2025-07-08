import React from 'react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/user': return 'Users';
    case '/cuenta': return 'Accounts';
    case '/movimiento': return 'Transfers';
    case '/favorito': return 'Favorites';
    case '/producto': return 'Products';
    case '/settings': return 'Settings';
    default: return 'Dashboard';
  }
};

const Topbar = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <div className="topbar">
      <h1 className="page-title">{pageTitle}</h1>
      <div className="user-profile">
        <div className="user-avatar">U</div>
      </div>
    </div>
  );
};

export default Topbar;