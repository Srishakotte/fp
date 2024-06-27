import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './Context/UserContext';

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
