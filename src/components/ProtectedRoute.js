import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, component: Component }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
