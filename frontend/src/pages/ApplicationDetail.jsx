import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await applicationAPI.getById(id);
      setApplication(response.data);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.detail || 'Failed to fetch application');
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await applicationAPI.updateStatus(id, newStatus);
      setApplication({ ...application, status: newStatus });
      alert('Status updated successfully!');
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating(false);
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
    return (
      <div className="container mt-2">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-2">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-2">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mt-2">
        <div className="alert alert-error">Application not found</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-2">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary mb-2">
        ← Back to Dashboard
      </button>

      <h1>Application Review</h1>

      <div className="grid mt-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content */}
        <div>
          {/* Student Information */}
          <div className="card">
            <h2>Student Information</h2>
            <div className="mt-2">
              <p><strong>Username:</strong> {application.student?.user?.username}</p>
              <p><strong>Email:</strong> {application.student?.user?.email}</p>
              {application.student?.user?.first_name && (
                <p><strong>Name:</strong> {application.student?.user?.first_name} {application.student?.user?.last_name}</p>
              )}
            </div>
          </div>

          {/* Internship Information */}
          <div className="card mt-2">
            <h2>Internship Details</h2>
            <div className="mt-2">
              <p><strong>Title:</strong> {application.internship?.title}</p>
              <p><strong>Location:</strong> {application.internship?.location}</p>
              <p><strong>Stipend:</strong> ₹{application.internship?.stipend}/month</p>
              <p><strong>Duration:</strong> {application.internship?.duration} months</p>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="card mt-2">
            <h2>Cover Letter</h2>
            <div className="mt-2" style={{ 
              padding: '1rem', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6'
            }}>
              {application.cover_letter}
            </div>
          </div>

          {/* Resume */}
          {application.cv_copy && (
            <div className="card mt-2">
              <h2>Resume/CV</h2>
              <div className="mt-2">
                <button 
                  onClick={async () => {
                    try {
                      const url = application.cv_copy.startsWith('http') 
                        ? application.cv_copy 
                        : `http://localhost:8000${application.cv_copy}`;
                      
                      const response = await fetch(url);
                      const blob = await response.blob();
                      const blobUrl = window.URL.createObjectURL(blob);
                      
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = application.cv_copy.split('/').pop();
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                      alert('Failed to download resume');
                    }
                  }}
                  className="btn btn-info"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  📄 Download Resume
                </button>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                  {application.cv_copy.split('/').pop()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Current Status */}
          <div className="card">
            <h3>Current Status</h3>
            <div className="mt-2">
              <span style={{ 
                background: getStatusColor(application.status) + '20',
                color: getStatusColor(application.status),
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                display: 'inline-block'
              }}>
                {application.status}
              </span>
            </div>
            <p className="mt-2" style={{ fontSize: '0.9rem', color: '#666' }}>
              Applied on: {new Date(application.applied_at).toLocaleDateString()}
            </p>
          </div>

          {/* Update Status */}
          <div className="card mt-2">
            <h3>Update Status</h3>
            <div className="flex flex-column gap-1 mt-2">
              <button 
                onClick={() => handleStatusChange('reviewing')}
                className="btn"
                style={{ background: '#3498db', color: 'white' }}
                disabled={updating || application.status === 'reviewing'}
              >
                Mark as Reviewing
              </button>
              <button 
                onClick={() => handleStatusChange('shortlisted')}
                className="btn"
                style={{ background: '#9b59b6', color: 'white' }}
                disabled={updating || application.status === 'shortlisted'}
              >
                Shortlist Candidate
              </button>
              <button 
                onClick={() => handleStatusChange('accepted')}
                className="btn btn-success"
                disabled={updating || application.status === 'accepted'}
              >
                Accept
              </button>
              <button 
                onClick={() => handleStatusChange('rejected')}
                className="btn btn-danger"
                disabled={updating || application.status === 'rejected'}
              >
                Reject
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-2">
            <h3>Quick Actions</h3>
            <div className="flex flex-column gap-1 mt-2">
              <button 
                onClick={() => navigate(`/internships/${application.internship?.id}/applicants`)}
                className="btn btn-info"
              >
                View All Applicants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
