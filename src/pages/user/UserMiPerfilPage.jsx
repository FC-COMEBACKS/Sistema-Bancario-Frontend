import React, { useEffect, useRef } from 'react';
import './userPage.css';
import { ProfileForm, UserDetails, Loader } from '../../components';
import { useUserDetails } from '../../shared/hooks';

const UserMiPerfilPage = () => {
  const { loading, error, userProfile, fetchCurrentUser } = useUserDetails();
  const userStored = localStorage.getItem('user');
  const user = userStored ? JSON.parse(userStored) : null;
  const hasCalledRef = useRef(false);
  
  const userId = user ? (user.uid || user._id || user.id || user.userId || user.data?.id) : null;

  useEffect(() => {
    if (userId && !hasCalledRef.current) {
      hasCalledRef.current = true;
      fetchCurrentUser(userId);
    }
  }, [userId, fetchCurrentUser]);

  const displayUserData = userProfile || user;

  const [activeView, setActiveView] = React.useState('details');

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="d-flex justify-content-center my-4">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            hasCalledRef.current = false;
            if (userId) fetchCurrentUser(userId);
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }
  
  return (
    <div className="user-profile-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Mi Perfil</h3>
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${activeView === 'details' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveView('details')}
          >
            Ver Detalles
          </button>
          <button 
            type="button" 
            className={`btn ${activeView === 'edit' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveView('edit')}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {activeView === 'details' ? (
        displayUserData ? (
          <UserDetails 
            userId={userId} 
            onEdit={() => setActiveView('edit')} 
            showEditButton={true}
            userProfile={displayUserData}
          />
        ) : (
          <div className="alert alert-warning">
            <h5>No se pudo cargar la información del perfil</h5>
            <p>Esto puede deberse a:</p>
            <ul>
              <li>Problemas de conexión con el servidor</li>
              <li>Usuario no encontrado</li>
              <li>Sesión expirada</li>
            </ul>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => {
                hasCalledRef.current = false;
                if (userId) fetchCurrentUser(userId);
              }}
            >
              Reintentar cargar perfil
            </button>
          </div>
        )
      ) : (
        <ProfileForm 
          onSuccess={() => {
            hasCalledRef.current = false;
            if (userId) {
              fetchCurrentUser(userId);
            }
            setActiveView('details');
          }} 
          initialData={displayUserData}
        />
      )}
    </div>
  );
};

export default UserMiPerfilPage;