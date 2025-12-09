import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, isCompany } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInternship = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await internshipAPI.getById(id);
      setInternship(response.data);
    } catch (err) {
      setError('Failed to fetch internship details');
    }
    setLoading(false);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    fetchInternship();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error || !internship) {
    return (
      <div className="container mt-2">
        <div className="alert alert-error">{error || 'Internship not found'}</div>
      </div>
    );
  }

  const isExpired = new Date(internship.last_date) < new Date();

  return (
    <div className="container mt-2">
      <div className="card">
        <div className="flex justify-between align-center mb-2">
          <h1>{internship.title}</h1>
          {isCompany && (
            <button onClick={() => navigate(`/internships/${id}/edit`)} className="btn btn-primary">
              Edit
            </button>
          )}
        </div>

        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <p><strong>Company:</strong> {internship.poster?.company_name || internship.poster?.user?.username}</p>
          <p><strong>Location:</strong> {internship.location} {internship.remote && <span style={{ color: '#27ae60' }}>• Remote</span>}</p>
          <p><strong>Stipend:</strong> ₹{internship.stipend}/month</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Last Date to Apply:</strong> {new Date(internship.last_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {internship.is_active && !isExpired ? <span style={{ color: '#27ae60' }}>Active</span> : <span style={{ color: '#e74c3c' }}>Closed</span>}</p>
        </div>
        
        <h3>About the Internship</h3>
        <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>{internship.description}</p>
        
        <h3 className="mt-2">Skills Required</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {internship.skills_required.split(',').map((skill, index) => (
            <span key={index} style={{ background: '#e3f2fd', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.9rem' }}>
              {skill.trim()}
            </span>
          ))}
        </div>
        
        <div className="mt-3" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
          <p><strong>Total Applications:</strong> {internship.applications_count || 0}</p>
          <p><strong>Posted on:</strong> {new Date(internship.created_at).toLocaleDateString()}</p>
        </div>

        {isStudent && internship.is_active && !isExpired && (
          <div className="mt-3">
            <button onClick={handleApplyClick} className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Apply Now
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="alert alert-info mt-3">
            Please <a href="/login" style={{ textDecoration: 'underline' }}>login</a> as a student to apply for this internship.
          </div>
        )}

        {isExpired && (
          <div className="alert alert-error mt-3">
            This internship application deadline has passed.
          </div>
        )}
      </div>

      {showApplyModal && (
        <ApplyModal
          internshipId={id}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default InternshipDetail;
