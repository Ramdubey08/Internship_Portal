import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateInternship = () => {
  const navigate = useNavigate();
  const { isCompany } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isCompany) {
    return (
      <div className="container mt-2">
        <div className="alert alert-error">
          Only companies can post internships.
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await internshipAPI.create(data);
      navigate(`/internships/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create internship');
    }
    
    setLoading(false);
  };

  return (
    <div className="container mt-2">
      <h1>Post a New Internship</h1>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="card mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Internship Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g., Full Stack Developer Intern"
            />
            {errors.title && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="6"
              placeholder="Describe the internship role, responsibilities, and what the intern will learn..."
            />
            {errors.description && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Skills Required *</label>
            <input
              type="text"
              {...register('skills_required', { required: 'Skills are required' })}
              placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
            />
            {errors.skills_required && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.skills_required.message}</span>}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Monthly Stipend (₹) *</label>
              <input
                type="number"
                {...register('stipend', { required: 'Stipend is required', min: 0 })}
                placeholder="10000"
              />
              {errors.stipend && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.stipend.message}</span>}
            </div>

            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                {...register('duration', { required: 'Duration is required' })}
                placeholder="e.g., 3 months, 6 months"
              />
              {errors.duration && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.duration.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              {...register('location', { required: 'Location is required' })}
              placeholder="e.g., Mumbai, Bangalore, Delhi"
            />
            {errors.location && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.location.message}</span>}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('remote')} style={{ width: 'auto' }} />
              Remote Position
            </label>
          </div>

          <div className="form-group">
            <label>Last Date to Apply *</label>
            <input
              type="date"
              {...register('last_date', { required: 'Last date is required' })}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.last_date && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.last_date.message}</span>}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('is_active')} defaultChecked style={{ width: 'auto' }} />
              Active (accepting applications)
            </label>
          </div>

          <div className="flex gap-1 mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Internship'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn" style={{ background: '#95a5a6', color: 'white' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;