import React from 'react';
import { NotFoundPage } from './pages';
import { AuthPage } from './pages/auth';
import { CuentaPage, MisCuentasPage } from './pages/cuenta';
import DashboardPage from './pages/dashboard/DashboardPage';
import { ProtectedRoute } from './components';
import UserPage from './pages/user/UserPage';
import UserMiPerfilPage from './pages/user/UserMiPerfilPage';
import MovimientoPage  from './pages/movimiento/MovimientoPage';

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
    path: '/cuenta',
    element: <ProtectedRoute element={<CuentaPage />} adminOnly={true} />
  },
  {
    path: '/mis-cuentas',
    element: <ProtectedRoute element={<MisCuentasPage />} />
  },
  {
    path: '/movimiento',
    element: <ProtectedRoute element={<MovimientoPage />} />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];