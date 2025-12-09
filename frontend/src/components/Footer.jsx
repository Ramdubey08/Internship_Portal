import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#2c3e50',
      color: 'white',
      padding: '3rem 0 1rem',
      marginTop: '4rem'
    }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Internship Portal</h3>
            <p style={{ color: '#ecf0f1', lineHeight: '1.6' }}>
              Connecting talented students with amazing companies for internship opportunities.
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/internships" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Browse Internships</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/about" style={{ color: '#ecf0f1', textDecoration: 'none' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/contact" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>For Students</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/register" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Sign Up</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/dashboard" style={{ color: '#ecf0f1', textDecoration: 'none' }}>My Dashboard</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/applications" style={{ color: '#ecf0f1', textDecoration: 'none' }}>My Applications</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem' }}>For Companies</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/register" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Post Internships</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/dashboard" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Company Dashboard</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/faq" style={{ color: '#ecf0f1', textDecoration: 'none' }}>FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #34495e',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
          color: '#95a5a6'
        }}>
          <p>&copy; 2025 Internship Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;