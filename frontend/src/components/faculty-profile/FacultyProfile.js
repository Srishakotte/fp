import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './FacultyProfile.css';
import Logout from '../Logout/Logout';

const FacultyProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.facultyHODAdmin);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:4000/lecture-api/notifications', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <div>Please log in to access your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Faculty Profile</h2>
        <nav className="profile-nav">
          <ul>
            <li><a href="/request-guest-lecture">Request Guest Lecture</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </nav>
        <Logout />
      </div>

      <div className="card">
        <h3>Welcome, {user.username}</h3>
        <p>Here you can manage your guest lecture requests and view your dashboard.</p>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <ul>
          <li><a href="/request-guest-lecture">Submit a new guest lecture request</a></li>
          <li><a href="/dashboard">View your dashboard</a></li>
        </ul>
      </div>

      <div className="card">
        <h3>Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification.message}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FacultyProfile;
