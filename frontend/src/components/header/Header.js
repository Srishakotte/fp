import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Header.css";

const Header = () => {
  return (
    <header className="bg-light p-3">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src="https://th.bing.com/th/id/OIP.CMgkU3tq5kmfuxWjbqevLAAAAA?rs=1&pid=ImgDetMain" alt="Logo" className="logo" />
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link home">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link login">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
