import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'CLIENTE';
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/auth');
  };

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
          <>
            <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128450;</span>
              Dashboard
            </Link>
            <Link to="/usuarios" className={`sidebar-item ${isActive('/usuarios') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128100;</span>
              Users
            </Link>
            <Link to="/producto" className={`sidebar-item ${isActive('/producto') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128230;</span>
              Products
            </Link>
            <Link to="/cuenta" className={`sidebar-item ${isActive('/cuenta') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128176;</span>
              Gestión Cuentas
            </Link>
            <Link to="/movimiento" className={`sidebar-item ${isActive('/movimiento') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#8646;</span>
              Movimientos
            </Link>
            <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#9881;</span>
              Settings
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#127968;</span>
              Home
            </Link>
            <Link to="/mis-cuentas" className={`sidebar-item ${isActive('/mis-cuentas') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128179;</span>
              Mis Cuentas
            </Link>
            <Link to="/movimientos" className={`sidebar-item ${isActive('/movimientos') || isActive('/movimiento') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#8646;</span>
              Transfers
            </Link>
            <Link to="/productos" className={`sidebar-item ${isActive('/productos') ? 'active' : ''}`}>
              <span className="sidebar-icon">&#128722;</span>
              Productos
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
      
      <div className="sidebar-footer">
        <button 
          onClick={handleLogout}
          className="sidebar-item sidebar-logout-btn"
        >
          <span className="sidebar-icon">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;