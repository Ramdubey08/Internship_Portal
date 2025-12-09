import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipAPI } from '../services/api';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async (query = '') => {
    setLoading(true);
    try {
      const params = query ? { q: query } : {};
      const response = await internshipAPI.getAll(params);
      setInternships(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships(searchQuery);
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container">
      <h1 className="mt-2">Available Internships</h1>

      <form onSubmit={handleSearch} className="mt-2">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </div>
      </form>

      <div className="grid mt-2">
        {internships.length === 0 ? (
          <p>No internships found.</p>
        ) : (
          internships.map((internship) => (
            <div key={internship.id} className="card">
              <h3 className="card-title">{internship.title}</h3>
              <p><strong>Company:</strong> {internship.poster?.company_name || internship.poster?.user?.username}</p>
              <p><strong>Location:</strong> {internship.location} {internship.remote && '(Remote)'}</p>
              <p><strong>Stipend:</strong> ₹{internship.stipend}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p className="card-text">{internship.description?.substring(0, 150)}...</p>
              <Link to={`/internships/${internship.id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InternshipList;
