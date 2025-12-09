import React from 'react';
import { Link } from 'react-router-dom';

const InternshipCard = ({ internship }) => {
  const isExpired = new Date(internship.last_date) < new Date();

  return (
    <div className="card">
      <div className="flex justify-between align-center mb-1">
        <h3 className="card-title" style={{ margin: 0 }}>{internship.title}</h3>
        {!internship.is_active || isExpired ? (
          <span style={{ background: '#f8d7da', color: '#721c24', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.85rem' }}>
            Closed
          </span>
        ) : (
          <span style={{ background: '#d4edda', color: '#155724', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.85rem' }}>
            Active
          </span>
        )}
      </div>

      <p style={{ fontWeight: 'bold', color: '#555', marginBottom: '0.5rem' }}>
        {internship.poster?.company_name || internship.poster?.user?.username}
      </p>

      <p style={{ color: '#666', marginBottom: '0.5rem' }}>
        📍 {internship.location} {internship.remote && <span style={{ color: '#27ae60' }}>• Remote</span>}
      </p>

      <p style={{ color: '#666', marginBottom: '0.5rem' }}>
        💰 ₹{internship.stipend}/month • ⏱️ {internship.duration}
      </p>

      <p className="card-text" style={{ marginBottom: '1rem' }}>
        {internship.description?.substring(0, 120)}...
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {internship.skills_required.split(',').slice(0, 3).map((skill, index) => (
          <span key={index} style={{ background: '#f0f0f0', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
            {skill.trim()}
          </span>
        ))}
      </div>

      <div className="flex justify-between align-center">
        <span style={{ fontSize: '0.85rem', color: '#999' }}>
          {internship.applications_count || 0} applications
        </span>
        <Link to={`/internships/${internship.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default InternshipCard;