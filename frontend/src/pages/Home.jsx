import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedInternships();
  }, []);

  const fetchFeaturedInternships = async () => {
    try {
      const response = await internshipAPI.getAll({ page_size: 3 });
      setFeaturedInternships(response.data.results || response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '4rem 0' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>India's #1 Internship Platform</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>
            Students find internships • Companies hire talented interns
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn" style={{ background: 'white', color: '#667eea', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  🎓 Register as Student
                </Link>
                <Link to="/register" className="btn" style={{ background: 'white', color: '#667eea', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  🏢 Register as Company
                </Link>
                <Link to="/internships" className="btn" style={{ background: 'transparent', border: '2px solid white', color: 'white', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                  Browse Internships
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn" style={{ background: 'white', color: '#667eea', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Go to Dashboard
                </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <h2 className="text-center mb-3">How It Works</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="text-center" style={{ color: '#667eea', marginBottom: '1.5rem' }}>🎓 For Students</h3>
          <div className="grid">
            <div className="card text-center">
              <h3>📝 Create Profile</h3>
              <p>Sign up and build your professional profile with skills and experience</p>
            </div>
            <div className="card text-center">
              <h3>🔍 Search Internships</h3>
              <p>Browse through hundreds of internship opportunities from top companies</p>
            </div>
            <div className="card text-center">
              <h3>✉️ Apply Easily</h3>
              <p>Submit applications with your resume and cover letter in one click</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-center" style={{ color: '#764ba2', marginBottom: '1.5rem' }}>🏢 For Companies</h3>
          <div className="grid">
            <div className="card text-center">
              <h3>📢 Post Internships</h3>
              <p>Create and publish internship opportunities to reach thousands of students</p>
            </div>
            <div className="card text-center">
              <h3>👥 Review Applications</h3>
              <p>Get applications from talented students and review their profiles easily</p>
            </div>
            <div className="card text-center">
              <h3>✅ Hire Top Talent</h3>
              <p>Connect with the best candidates and build your team efficiently</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <h2 className="text-center mb-3">Featured Internships</h2>
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="grid">
            {featuredInternships.map((internship) => (
              <div key={internship.id} className="card">
                <h3>{internship.title}</h3>
                <p><strong>{internship.poster?.company_name || 'Company'}</strong></p>
                <p>{internship.location} {internship.remote && '• Remote'}</p>
                <p>₹{internship.stipend}/month • {internship.duration}</p>
                <Link to={`/internships/${internship.id}`} className="btn btn-primary mt-2">View Details</Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-3">
          <Link to="/internships" className="btn btn-primary">View All Internships</Link>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '3rem 0', marginTop: '3rem' }}>
        <div className="container">
          <div className="grid">
            <div className="card">
              <h3>For Students</h3>
              <p>Access exclusive internship opportunities and build your career</p>
              <ul>
                <li>Personalized recommendations</li>
                <li>Easy application tracking</li>
                <li>Direct company connections</li>
              </ul>
            </div>
            <div className="card">
              <h3>For Companies</h3>
              <p>Find talented interns to grow your team</p>
              <ul>
                <li>Post unlimited internships</li>
                <li>Review applications efficiently</li>
                <li>Connect with top talent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
