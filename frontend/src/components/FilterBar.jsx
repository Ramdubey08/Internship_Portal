import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FilterBar = ({ onFilter }) => {
  const { register, handleSubmit, reset } = useForm();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onSubmit = (data) => {
    const filters = {};
    Object.keys(data).forEach(key => {
      if (data[key]) filters[key] = data[key];
    });
    onFilter(filters);
  };

  const handleReset = () => {
    reset();
    onFilter({});
  };

  return (
    <div className="card mt-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              {...register('q')}
              placeholder="Search by title, skills, description..."
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              {...register('location')}
              placeholder="e.g., Mumbai, Bangalore"
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              {...register('skills')}
              placeholder="e.g., React, Python"
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Filters
          </button>
        </div>

        {showAdvanced && (
          <div className="grid mt-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" {...register('remote')} value="true" style={{ width: 'auto' }} />
                Remote Only
              </label>
            </div>

            <div className="form-group">
              <label>Sort By</label>
              <select {...register('ordering')}>
                <option value="">Default</option>
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-stipend">Highest Stipend</option>
                <option value="stipend">Lowest Stipend</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-1 mt-2">
          <button type="submit" className="btn btn-primary">
            🔍 Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="btn" style={{ background: '#95a5a6', color: 'white' }}>
            ✕ Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;