import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, profile } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo Section */}
          <div className="navbar-brand">
            <Link to="/" className="logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">InternHub</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="navbar-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/internships" className="nav-link">Internships</Link></li>
            
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                <li>
                  <Link to="/profile" className="nav-link profile-link">
                    <span className="profile-icon">👤</span>
                    <span>Profile</span>
                    <span className="role-badge">{profile?.role}</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout} 
                    className="logout-btn"
                  >
                    <span>Logout</span>
                    <span className="logout-icon">🚪</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link login-link">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link register-link">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
