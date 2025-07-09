import React, { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { routes } from './routes'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname.includes('/auth');

  useEffect(() => {
    // Verificar si hay una sesión válida al cargar la aplicación
    const checkAuthStatus = () => {
      try {
        const userString = localStorage.getItem('user');
        
        // Si no hay usuario o estamos en una página que no es de auth
        if (!userString && !isAuthPage) {
          console.log('No hay sesión válida, redirigiendo al login');
          navigate('/auth');
          return;
        }

        // Si hay usuario pero está en auth, redirigir al dashboard
        if (userString && isAuthPage) {
          const userData = JSON.parse(userString);
          const role = (userData.rol || userData.role || '').toLowerCase();
          
          if (role.includes('admin')) {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard/cliente');
          }
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        // Si hay error al parsear, limpiar localStorage y redirigir
        localStorage.removeItem('user');
        if (!isAuthPage) {
          navigate('/auth');
        }
      }
    };

    checkAuthStatus();
  }, [location.pathname, navigate, isAuthPage]);

  return (
    <>
      {isAuthPage ? (
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <span className="sidebar-logo-icon">&#127974;</span>
              BANK
            </div>
          </div>
          <div className="login-content">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </div>
        </div>
      ) : (
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <div className="page-container">
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default App