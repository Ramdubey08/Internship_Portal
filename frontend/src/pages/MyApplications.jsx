import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyApplications = () => {
  const { profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await applicationAPI.getAll();
      setApplications(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch applications');
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

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mt-2">
      <h1>My Applications</h1>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="card mt-2">
        <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            className="btn"
            style={{ background: filter === 'all' ? '#3498db' : '#ecf0f1', color: filter === 'all' ? 'white' : '#333' }}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className="btn"
            style={{ background: filter === 'pending' ? '#f39c12' : '#ecf0f1', color: filter === 'pending' ? 'white' : '#333' }}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('reviewing')}
            className="btn"
            style={{ background: filter === 'reviewing' ? '#3498db' : '#ecf0f1', color: filter === 'reviewing' ? 'white' : '#333' }}
          >
            Reviewing ({applications.filter(a => a.status === 'reviewing').length})
          </button>
          <button
            onClick={() => setFilter('shortlisted')}
            className="btn"
            style={{ background: filter === 'shortlisted' ? '#9b59b6' : '#ecf0f1', color: filter === 'shortlisted' ? 'white' : '#333' }}
          >
            Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className="btn"
            style={{ background: filter === 'accepted' ? '#27ae60' : '#ecf0f1', color: filter === 'accepted' ? 'white' : '#333' }}
          >
            Accepted ({applications.filter(a => a.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className="btn"
            style={{ background: filter === 'rejected' ? '#e74c3c' : '#ecf0f1', color: filter === 'rejected' ? 'white' : '#333' }}
          >
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="card mt-2 text-center">
          <p>No applications found</p>
          <Link to="/internships" className="btn btn-primary mt-2">Browse Internships</Link>
        </div>
      ) : (
        <div className="grid mt-2">
          {filteredApplications.map((application) => (
            <div key={application.id} className="card">
              <div className="flex justify-between align-center mb-1">
                <h3>{application.internship?.title}</h3>
                <span style={{ 
                  background: getStatusColor(application.status) + '20',
                  color: getStatusColor(application.status),
                  padding: '0.25rem 0.75rem',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {application.status}
                </span>
              </div>
              
              <p><strong>Company:</strong> {application.internship?.poster?.company_name || 'N/A'}</p>
              <p><strong>Location:</strong> {application.internship?.location}</p>
              <p><strong>Stipend:</strong> ₹{application.internship?.stipend}/month</p>
              <p><strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
              
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.9rem', margin: 0 }}><strong>Your Cover Letter:</strong></p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#555' }}>
                  {application.cover_letter.substring(0, 150)}...
                </p>
              </div>

              <Link to={`/internships/${application.internship?.id}`} className="btn btn-primary mt-2">
                View Internship
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;