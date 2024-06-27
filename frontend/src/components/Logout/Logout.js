import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or any necessary logout logic
    localStorage.removeItem('token');  // Assuming the token is stored in localStorage
    navigate('/login');  // Redirect to the login page after logging out
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
