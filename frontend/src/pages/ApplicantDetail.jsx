import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { applicationAPI, internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplicantDetail = () => {
  const { id } = useParams();
  const { isCompany } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isCompany) {
        const [internResponse, appsResponse] = await Promise.all([
          internshipAPI.getById(id),
          applicationAPI.getAll()
        ]);
        setInternship(internResponse.data);
        const filtered = (appsResponse.data.results || appsResponse.data).filter(
          app => app.internship?.id === parseInt(id)
        );
        setApplicants(filtered);
      }
    } catch (err) {
      setError('Failed to fetch applicants');
    }
    setLoading(false);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await applicationAPI.updateStatus(applicationId, newStatus);
      setApplicants(applicants.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating(null);
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
      <h1>Applicants for {internship?.title}</h1>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="card mt-2">
        <h3>Internship Details</h3>
        <p><strong>Location:</strong> {internship?.location}</p>
        <p><strong>Stipend:</strong> ₹{internship?.stipend}/month</p>
        <p><strong>Total Applications:</strong> {applicants.length}</p>
      </div>

      <div className="grid mt-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="card text-center">
          <h3 style={{ color: '#f39c12' }}>{applicants.filter(a => a.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="card text-center">
          <h3 style={{ color: '#3498db' }}>{applicants.filter(a => a.status === 'reviewing').length}</h3>
          <p>Reviewing</p>
        </div>
        <div className="card text-center">
          <h3 style={{ color: '#9b59b6' }}>{applicants.filter(a => a.status === 'shortlisted').length}</h3>
          <p>Shortlisted</p>
        </div>
        <div className="card text-center">
          <h3 style={{ color: '#27ae60' }}>{applicants.filter(a => a.status === 'accepted').length}</h3>
          <p>Accepted</p>
        </div>
        <div className="card text-center">
          <h3 style={{ color: '#e74c3c' }}>{applicants.filter(a => a.status === 'rejected').length}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <h2 className="mt-3">All Applicants</h2>
      {applicants.length === 0 ? (
        <div className="card text-center">
          <p>No applications received yet</p>
        </div>
      ) : (
        <div className="grid mt-2">
          {applicants.map((application) => (
            <div key={application.id} className="card">
              <div className="flex justify-between align-center mb-2">
                <h3>{application.student?.user?.username}</h3>
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

              <p><strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
              
              {application.student?.skills && (
                <div className="mt-2">
                  <p><strong>Skills:</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {application.student.skills.split(',').slice(0, 5).map((skill, idx) => (
                      <span key={idx} style={{ background: '#e3f2fd', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.9rem', margin: 0 }}><strong>Cover Letter:</strong></p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#555', whiteSpace: 'pre-wrap' }}>
                  {application.cover_letter}
                </p>
              </div>

              <div className="form-group mt-2">
                <label><strong>Update Status:</strong></label>
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(application.id, e.target.value)}
                  disabled={updating === application.id}
                  style={{ width: '100%' }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDetail;