import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './Context/UserContext';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:4000/faculty-api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.data);
        } else {
          setError('No token found');
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        setError(error.response ? error.response.data.message : 'Error fetching user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
