import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A wrapper component to protect routes that require authentication
 */
const ProtectedRoute = ({ element, redirectTo = '/auth' }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectTo: PropTypes.string
};

export default ProtectedRoute;
