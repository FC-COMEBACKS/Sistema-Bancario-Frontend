import React from 'react';
import { AuthPage } from './pages/auth';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/notFoundPage';
import { ProtectedRoute } from './components';
import UserPage from './pages/user/UserPage';
import UserMiPerfilPage from './pages/user/UserMiPerfilPage';

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
    path: '/usuarios',
    element: <ProtectedRoute element={<UserPage />} adminOnly={true} />
  },
  {
    path: '/mi-perfil',
    element: <ProtectedRoute element={<UserMiPerfilPage />} />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];