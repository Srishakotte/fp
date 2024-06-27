import './Login.css';
import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/slices/facultyHODAdminSlice';
import { UserContext } from '../../Context/UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { loading, error } = useSelector((state) => state.facultyHODAdmin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ username, password, role })).unwrap();
      const { user, token } = response;

      setUser({ ...user, role });
      localStorage.setItem('token', token);

      if (role === 'admin') {
        navigate('/admin-profile');
      } else if (role === 'hod') {
        navigate('/hod-profile');
      } else {
        navigate('/faculty-profile');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Login</h2>
        </div>
        <div className="card-body">
          {error && <div className="text-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                className="form-control"
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-control"
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-check">
              <input 
                type="radio" 
                id="role-admin" 
                name="role" 
                className="form-check-input"
                value="admin" 
                checked={role === 'admin'} 
                onChange={(e) => setRole(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="role-admin">Admin</label>
            </div>
            <div className="form-check">
              <input 
                type="radio" 
                id="role-faculty" 
                name="role" 
                className="form-check-input"
                value="faculty" 
                checked={role === 'faculty'} 
                onChange={(e) => setRole(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="role-faculty">Faculty</label>
            </div>
            <div className="form-check">
              <input 
                type="radio" 
                id="role-hod" 
                name="role" 
                className="form-check-input"
                value="hod" 
                checked={role === 'hod'} 
                onChange={(e) => setRole(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="role-hod">HOD</label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
