import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullProfile, setShowFullProfile] = useState(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Student Information</h2>
              <button 
                onClick={() => setShowFullProfile(!showFullProfile)}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {showFullProfile ? '📋 Hide Full Profile' : '👤 View Full Profile'}
              </button>
            </div>
            <div className="mt-2">
              <p><strong>Username:</strong> {application.student?.user?.username}</p>
              <p><strong>Email:</strong> {application.student?.user?.email}</p>
              {application.student?.user?.first_name && (
                <p><strong>Name:</strong> {application.student?.user?.first_name} {application.student?.user?.last_name}</p>
              )}
              {application.student?.phone && (
                <p><strong>Phone:</strong> {application.student?.phone}</p>
              )}
            </div>
          </div>

          {/* Complete Student Profile - Collapsible */}
          {showFullProfile && (
            <div className="card mt-2" style={{ 
              border: '2px solid #667eea',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <h2 style={{ color: '#667eea' }}>📚 Complete Student Profile</h2>
              
              {/* Education */}
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#3498db' }}>🎓 Education</h3>
                {application.student?.college || application.student?.degree || application.student?.graduation_year ? (
                  <>
                    {application.student?.college && (
                      <p><strong>College:</strong> {application.student.college}</p>
                    )}
                    {application.student?.degree && (
                      <p><strong>Degree:</strong> {application.student.degree}</p>
                    )}
                    {application.student?.graduation_year && (
                      <p><strong>Graduation Year:</strong> {application.student.graduation_year}</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No education information provided</p>
                )}
              </div>

              {/* Bio */}
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#3498db' }}>📝 About</h3>
                {application.student?.bio ? (
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{application.student.bio}</p>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No bio provided</p>
                )}
              </div>

              {/* Skills */}
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#3498db' }}>💡 Skills</h3>
                {application.student?.skills ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {application.student.skills.split(',').map((skill, index) => (
                      <span key={index} style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.4rem 0.9rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No skills listed</p>
                )}
              </div>

              {/* Online Presence */}
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#3498db' }}>🔗 Online Presence</h3>
                {application.student?.github || application.student?.linkedin || application.student?.portfolio ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {application.student?.github && (
                      <a 
                        href={application.student.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          background: '#333',
                          color: 'white',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>🐙</span> GitHub
                      </a>
                    )}
                    {application.student?.linkedin && (
                      <a 
                        href={application.student.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          background: '#0077b5',
                          color: 'white',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>💼</span> LinkedIn
                      </a>
                    )}
                    {application.student?.portfolio && (
                      <a 
                        href={application.student.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>🌐</span> Portfolio
                      </a>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No online profiles linked</p>
                )}
              </div>

              {/* Student Resume */}
              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#3498db' }}>📄 Profile Resume</h3>
                {application.student?.cv ? (
                  <button 
                    onClick={async () => {
                      try {
                        const url = application.student.cv.startsWith('http') 
                          ? application.student.cv 
                          : `http://localhost:8000${application.student.cv}`;
                        
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = application.student.cv.split('/').pop();
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
                    📥 Download Profile Resume
                  </button>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>No profile resume uploaded</p>
                )}
              </div>
            </div>
          )}

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
