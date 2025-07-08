import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  // Simulación para desarrollo - luego vendrá de autenticación real
  const role = localStorage.getItem('userRole') || 'CLIENTE';
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <span className="sidebar-logo-icon">&#127974;</span>
          {role === 'ADMIN' ? 'ADMIN' : 'BANK'}
        </Link>
      </div>
      
      <nav className="sidebar-menu">
        {role === 'ADMIN' ? (
          // Menú de administrador
          <>
            <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128450;</span>
              Dashboard
            </Link>
            <Link to="/user" className={`sidebar-item ${isActive('/user') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128100;</span>
              Users
            </Link>
            <Link to="/producto" className={`sidebar-item ${isActive('/producto') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128230;</span>
              Products
            </Link>
            <Link to="/cuenta" className={`sidebar-item ${isActive('/cuenta') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128176;</span>
              Accounts
            </Link>
            <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#9881;</span>
              Settings
            </Link>
          </>
        ) : (
          // Menú de cliente
          <>
            <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#127968;</span>
              Home
            </Link>
            <Link to="/cuenta" className={`sidebar-item ${isActive('/cuenta') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128179;</span>
              Accounts
            </Link>
            <Link to="/movimiento" className={`sidebar-item ${isActive('/movimiento') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#8646;</span>
              Transfers
            </Link>
            <Link to="/favorito" className={`sidebar-item ${isActive('/favorito') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#9825;</span>
              Favorites
            </Link>
            <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#9881;</span>
              Settings
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;