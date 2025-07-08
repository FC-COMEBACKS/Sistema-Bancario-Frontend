import React from 'react';
import { AuthPage } from './pages/auth';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/notFoundPage';
import { ProtectedRoute } from './components';

// Asegúrate de que este arreglo se llame 'routes' y esté exportado
export const routes = [
  {
    path: '/auth',
    element: <AuthPage />
  },
  {
    path: '/auth/register',
    element: <AuthPage />
  },
  {
    path: '/auth/recuperar-password',
    element: <AuthPage />
  },
  {
    path: '/',
    element: <ProtectedRoute element={<DashboardPage />} />
  },
  {
    path: '/dashboard/admin',
    element: <ProtectedRoute element={<DashboardPage />} />
  },
  {
    path: '/dashboard/cliente',
    element: <ProtectedRoute element={<DashboardPage />} />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];