import React, { useEffect, useRef, useState } from 'react';
import './miPerfil.css';
import { Loader } from '../../components';
import { useUserDetails } from '../../shared/hooks';

const UserMiPerfilPage = () => {
  const { loading, error, userProfile, fetchCurrentUser } = useUserDetails();
  const userStored = localStorage.getItem('user');
  const user = userStored ? JSON.parse(userStored) : null;
  const hasCalledRef = useRef(false);
  
  // Estados para controlar la navegación
  const [activeTab, setActiveTab] = useState('personal');
  const [activeView, setActiveView] = useState('details');
  
  const userId = user ? (user.uid || user._id || user.id || user.userId || user.data?.id) : null;

  useEffect(() => {
    if (userId && !hasCalledRef.current) {
      hasCalledRef.current = true;
      fetchCurrentUser(userId);
    }
  }, [userId, fetchCurrentUser]);

  const displayUserData = userProfile || user;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Aquí implementarías la lógica de guardado
    console.log('Guardando perfil...');
    setActiveView('details');
  };

  if (loading) {
    return (
      <div className="mi-perfil-page">
        <div className="perfil-loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mi-perfil-page">
        <div className="perfil-error">
          <p>Error: {error}</p>
          <button 
            className="btn-reintentar"
            onClick={() => {
              hasCalledRef.current = false;
              if (userId) fetchCurrentUser(userId);
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mi-perfil-page">
      <header className="mi-perfil-header">
        <h1>MI PERFIL</h1>
        <button className="btn-salir">SALIR</button>
      </header>

      <div className="mi-perfil-container">
        <aside className="mi-perfil-sidebar">
          <ul className="sidebar-menu">
            <li 
              className={activeTab === 'personal' ? 'active' : ''}
              onClick={() => setActiveTab('personal')}
            >
              Información personal
            </li>
          </ul>
        </aside>
        <main className="mi-perfil-main">
          <div className="content-header">
            <h2>Información personal</h2>
            <div className="view-buttons">
              <button 
                className={`btn-toggle ${activeView === 'details' ? 'active' : ''}`}
                onClick={() => setActiveView('details')}
              >
                Ver Detalles
              </button>
              <button 
                className={`btn-toggle ${activeView === 'edit' ? 'active' : ''}`}
                onClick={() => setActiveView('edit')}
              >
                Editar Perfil
              </button>
            </div>
          </div>

          {activeView === 'details' ? (
            <div className="profile-details">
              <div className="field-group">
                <label>Nombre</label>
                <p>{displayUserData?.nombre || 'Marco'}</p>
              </div>
              <div className="field-group">
                <label>Correo</label>
                <p>{displayUserData?.email || 'adminb@admin.com'}</p>
              </div>
              <div className="field-group">
                <label>Usuario</label>
                <p>{displayUserData?.username || 'Administrador'}</p>
              </div>
              <div className="field-group">
                <label>DPI</label>
                <p>{displayUserData?.dpi || '3799405I234'}</p>
              </div>
              <div className="field-group">
                <label>Teléfono</label>
                <div className="status-badge active">Activo</div>
              </div>
              <div className="field-group">
                <label>Estado</label>
                <p>{displayUserData?.estado || 'ACTIVO'}</p>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-field">
                <label>Correo</label>
                <input 
                  type="email" 
                  defaultValue={displayUserData?.email || 'adminb@admin.com'}
                />
              </div>
              <div className="form-field">
                <label>Usuario</label>
                <input 
                  type="text" 
                  defaultValue={displayUserData?.username || 'Administrador'}
                />
              </div>
              <div className="form-field">
                <label>Rol</label>
                <input 
                  type="text" 
                  defaultValue={displayUserData?.rol || 'Administrador'}
                />
              </div>
              <div className="form-field">
                <label>DPI</label>
                <input 
                  type="text" 
                  defaultValue={displayUserData?.dpi || '3799633330'}
                />
              </div>
              <div className="form-field">
                <label>Estado</label>
                <select defaultValue={displayUserData?.estado || 'Activo'}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => setActiveView('details')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserMiPerfilPage;