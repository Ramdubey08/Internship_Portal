import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { internshipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCompany } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCompany) {
      navigate('/dashboard');
      return;
    }
    fetchInternship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInternship = async () => {
    try {
      const response = await internshipAPI.getById(id);
      const internship = response.data;
      
      setValue('title', internship.title);
      setValue('description', internship.description);
      setValue('skills_required', internship.skills_required);
      setValue('stipend', internship.stipend);
      setValue('duration', internship.duration);
      setValue('location', internship.location);
      setValue('remote', internship.remote);
      setValue('last_date', internship.last_date);
      setValue('is_active', internship.is_active);
    } catch (err) {
      setError('Failed to load internship');
    }
    setFetchLoading(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await internshipAPI.update(id, data);
      navigate(`/internships/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update internship');
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return;
    }

    try {
      await internshipAPI.delete(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete internship');
    }
  };

  if (fetchLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mt-2">
      <h1>Edit Internship</h1>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="card mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Internship Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="6"
            />
            {errors.description && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Skills Required *</label>
            <input
              type="text"
              {...register('skills_required', { required: 'Skills are required' })}
            />
            {errors.skills_required && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.skills_required.message}</span>}
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Monthly Stipend (₹) *</label>
              <input
                type="number"
                {...register('stipend', { required: 'Stipend is required', min: 0 })}
              />
              {errors.stipend && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.stipend.message}</span>}
            </div>

            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                {...register('duration', { required: 'Duration is required' })}
              />
              {errors.duration && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.duration.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              {...register('location', { required: 'Location is required' })}
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
            />
            {errors.last_date && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.last_date.message}</span>}
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" {...register('is_active')} style={{ width: 'auto' }} />
              Active (accepting applications)
            </label>
          </div>

          <div className="flex justify-between mt-3">
            <div className="flex gap-1">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => navigate(`/internships/${id}`)} className="btn" style={{ background: '#95a5a6', color: 'white' }}>
                Cancel
              </button>
            </div>
            <button type="button" onClick={handleDelete} className="btn btn-danger">
              Delete Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternship;