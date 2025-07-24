import React from 'react';
import { NotFoundPage } from './pages';
import { AuthPage } from './pages/auth';
import { CuentaPage, MisCuentasPage } from './pages/cuenta';
import DashboardPage from './pages/dashboard/DashboardPage';
import DivisaPage from './pages/divisa/DivisaPage';
import FavoritoPage from './pages/favorito/FavoritoPage';
import { ProtectedRoute } from './components';
import UserPage from './pages/user/UserPage';
import UserMiPerfilPage from './pages/user/UserMiPerfilPage';
import MovimientoPage  from './pages/movimiento/MovimientoPage';
import ProductoServicioPage from './pages/productoServicio/ProductoServicioPage';
import { SettingsPage } from './pages/settings';

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
    path: '/movimientos',
    element: <ProtectedRoute element={<MovimientoPage />} />
  },
  {
    path: '/transferencias',
    element: <ProtectedRoute element={<MovimientoPage />} />
  },
  {
    path: '/depositos',
    element: <ProtectedRoute element={<MovimientoPage />} />
  },
  {
    path: '/creditos',
    element: <ProtectedRoute element={<MovimientoPage />} />
  },
  {
    path: '/producto',
    element: <ProtectedRoute element={<ProductoServicioPage />} adminOnly={true} />
  },
  {
    path: '/productos',
    element: <ProtectedRoute element={<ProductoServicioPage />} />
  },
  {
    path: '/divisas',
    element: <ProtectedRoute element={<DivisaPage />} />
  },
  {
    path: '/convertir',
    element: <ProtectedRoute element={<DivisaPage />} />
  },
  {
    path: '/tasas-cambio',
    element: <ProtectedRoute element={<DivisaPage />} />
  },
  {
    path: '/favoritos',
    element: <ProtectedRoute element={<FavoritoPage />} />
  },
  {
    path: '/contactos',
    element: <ProtectedRoute element={<FavoritoPage />} />
  },
  {
    path: '/settings',
    element: <ProtectedRoute element={<SettingsPage />} />
  },
  {
    path: '/perfil',
    element: <ProtectedRoute element={<UserMiPerfilPage />} />
  },
  {
    path: '/cambiar-password',
    element: <ProtectedRoute element={<UserMiPerfilPage />} />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];