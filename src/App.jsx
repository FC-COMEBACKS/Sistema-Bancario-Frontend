import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { routes } from './routes'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

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