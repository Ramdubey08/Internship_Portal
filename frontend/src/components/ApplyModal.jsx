import React, { useState } from 'react';
import { applicationAPI } from '../services/api';

const ApplyModal = ({ internshipId, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setCvFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('internship_id', internshipId);
      formData.append('cover_letter', coverLetter);
      if (cvFile) {
        formData.append('cv_copy', cvFile);
      }

      // Submit application with FormData
      const response = await applicationAPI.create(formData);

      // Show success toast
      setShowSuccess(true);
      
      // Wait 2 seconds then close and refresh
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Application error:', err);
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.error
        || Object.values(err.response?.data || {})[0]
        || 'Failed to submit application';
      setError(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Success Toast */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#27ae60',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            zIndex: 2000,
            animation: 'slideIn 0.3s ease-out'
          }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>✓ Application Submitted!</h3>
            <p style={{ margin: 0 }}>Your application has been sent successfully</p>
          </div>
        )}

        <div className="flex justify-between align-center mb-2">
          <h2>Apply for this Internship</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cover Letter *</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
              rows="8"
              placeholder="Explain why you're a good fit for this internship. Highlight relevant skills, experience, and your enthusiasm for the role..."
              style={{ resize: 'vertical' }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              💡 Tip: Customize your cover letter for each application to increase your chances
            </small>
          </div>

          <div className="form-group">
            <label>Resume (Optional)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ border: '1px dashed #ddd', padding: '1rem' }}
            />
            {cvFile && (
              <p style={{ marginTop: '0.5rem', color: '#27ae60' }}>
                ✓ {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              Upload an updated resume (PDF, DOC, DOCX - Max 5MB)
            </small>
          </div>

          <div className="flex gap-1 mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading || showSuccess}>
              {loading ? '⏳ Submitting...' : showSuccess ? '✓ Submitted!' : '📧 Submit Application'}
            </button>
            <button type="button" onClick={onClose} className="btn" style={{ background: '#95a5a6', color: 'white' }} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>

        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ApplyModal;