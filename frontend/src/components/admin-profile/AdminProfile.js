import "./AdminProfile.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from '../Logout/Logout';

const AdminProfile = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (username) => {
    // Add your delete user logic here
  };

  const handleCreateAccount = () => {
    navigate('/SignUp');
  };

  return (
    <div>
      <h2>Admin Profile</h2>
      <Logout />
      <button onClick={handleCreateAccount}>Create Account</button>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            {user.username} ({user.role})
            <button onClick={() => handleDelete(user.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProfile;
