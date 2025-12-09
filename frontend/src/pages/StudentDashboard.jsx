import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI, internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsResponse, internsResponse] = await Promise.all([
        applicationAPI.getAll(),
        internshipAPI.getAll({ page_size: 3 })
      ]);
      setApplications(appsResponse.data.results || appsResponse.data);
      setRecommendations(internsResponse.data.results || internsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      reviewing: '#3498db',
      shortlisted: '#9b59b6',
      accepted: '#27ae60',
      rejected: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mt-2">
      <h1>Student Dashboard</h1>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="grid mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card text-center">
          <h2 style={{ color: '#3498db', fontSize: '2.5rem' }}>{applications.length}</h2>
          <p>Total Applications</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#27ae60', fontSize: '2.5rem' }}>
            {applications.filter(a => a.status === 'accepted').length}
          </h2>
          <p>Accepted</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#f39c12', fontSize: '2.5rem' }}>
            {applications.filter(a => a.status === 'pending').length}
          </h2>
          <p>Pending</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#9b59b6', fontSize: '2.5rem' }}>
            {applications.filter(a => a.status === 'shortlisted').length}
          </h2>
          <p>Shortlisted</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between align-center mb-2">
          <h2>My Applications</h2>
          <Link to="/applications" className="btn btn-primary">View All</Link>
        </div>

        {applications.length === 0 ? (
          <div className="card text-center">
            <p>You haven't applied to any internships yet</p>
            <Link to="/internships" className="btn btn-primary mt-2">Browse Internships</Link>
          </div>
        ) : (
          <div className="grid">
            {applications.slice(0, 3).map((application) => (
              <div key={application.id} className="card">
                <h3>{application.internship?.title}</h3>
                <p><strong>Company:</strong> {application.internship?.poster?.company_name}</p>
                <p><strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: getStatusColor(application.status), fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {application.status}
                  </span>
                </p>
                <Link to={`/internships/${application.internship?.id}`} className="btn btn-primary mt-2">
                  View Internship
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3">
        <h2 className="mb-2">Recommended for You</h2>
        <div className="grid">
          {recommendations.map((internship) => (
            <div key={internship.id} className="card">
              <h3>{internship.title}</h3>
              <p><strong>{internship.poster?.company_name}</strong></p>
              <p>{internship.location} {internship.remote && '• Remote'}</p>
              <p>₹{internship.stipend}/month</p>
              <Link to={`/internships/${internship.id}`} className="btn btn-primary mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      {!profile?.skills && (
        <div className="alert alert-info mt-3">
          <strong>Complete your profile!</strong> Add your skills to get better internship recommendations.
          <Link to="/profile" style={{ marginLeft: '1rem', textDecoration: 'underline' }}>Update Profile</Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;