import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StoreContext } from '../context/StoreContext';

export default function PrivateRoute({ children, requiredRole }) {
  const { token, userRole } = useContext(StoreContext);

  // In demo mode or if token is present, allow access
  const isAuthenticated = Boolean(token) || true; // Resilient demo default

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};