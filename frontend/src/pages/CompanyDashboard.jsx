import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyDashboard = () => {
  const { profile } = useAuth();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [internsResponse, appsResponse] = await Promise.all([
        internshipAPI.getAll({ my_internships: true }),
        applicationAPI.getAll()
      ]);
      setInternships(internsResponse.data.results || internsResponse.data);
      setApplications(appsResponse.data.results || appsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  const activeInternships = internships.filter(i => i.is_active);
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container mt-2">
      <div className="flex justify-between align-center">
        <h1>Company Dashboard</h1>
        <Link to="/internships/create" className="btn btn-success">
          + Post New Internship
        </Link>
      </div>

      {error && <div className="alert alert-error mt-2">{error}</div>}

      <div className="grid mt-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card text-center">
          <h2 style={{ color: '#3498db', fontSize: '2.5rem' }}>{internships.length}</h2>
          <p>Total Internships</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#27ae60', fontSize: '2.5rem' }}>{activeInternships.length}</h2>
          <p>Active Internships</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#9b59b6', fontSize: '2.5rem' }}>{totalApplications}</h2>
          <p>Total Applications</p>
        </div>
        <div className="card text-center">
          <h2 style={{ color: '#f39c12', fontSize: '2.5rem' }}>{pendingApplications}</h2>
          <p>Pending Review</p>
        </div>
      </div>

      <div className="mt-3">
        <h2 className="mb-2">My Internships</h2>
        
        {internships.length === 0 ? (
          <div className="card text-center">
            <p>You haven't posted any internships yet</p>
            <Link to="/internships/create" className="btn btn-success mt-2">
              Post Your First Internship
            </Link>
          </div>
        ) : (
          <div className="grid">
            {internships.map((internship) => (
              <div key={internship.id} className="card">
                <div className="flex justify-between align-center">
                  <h3>{internship.title}</h3>
                  <span style={{ 
                    background: internship.is_active ? '#d4edda' : '#f8d7da', 
                    color: internship.is_active ? '#155724' : '#721c24',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '15px',
                    fontSize: '0.85rem'
                  }}>
                    {internship.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p><strong>Location:</strong> {internship.location} {internship.remote && '(Remote)'}</p>
                <p><strong>Stipend:</strong> ₹{internship.stipend}/month</p>
                <p><strong>Applications:</strong> {internship.applications_count || 0}</p>
                <p><strong>Last Date:</strong> {new Date(internship.last_date).toLocaleDateString()}</p>
                <div className="flex gap-1 mt-2">
                  <Link to={`/internships/${internship.id}`} className="btn btn-primary">
                    View
                  </Link>
                  <Link to={`/internships/${internship.id}/edit`} className="btn" style={{ background: '#95a5a6', color: 'white' }}>
                    Edit
                  </Link>
                  <Link to={`/internships/${internship.id}/applicants`} className="btn btn-success">
                    Applicants ({internship.applications_count || 0})
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3">
        <h2 className="mb-2">Recent Applications</h2>
        {applications.length === 0 ? (
          <div className="card text-center">
            <p>No applications yet</p>
          </div>
        ) : (
          <div className="grid">
            {applications.slice(0, 3).map((application) => (
              <div key={application.id} className="card">
                <h3>{application.student?.user?.username}</h3>
                <p><strong>Applied for:</strong> {application.internship?.title}</p>
                <p><strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {application.status}
                  </span>
                </p>
                <Link to={`/applications/${application.id}`} className="btn btn-primary mt-2">
                  Review Application
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {!profile?.company_name && (
        <div className="alert alert-info mt-3">
          <strong>Complete your company profile!</strong> Add your company name and logo.
          <Link to="/profile" style={{ marginLeft: '1rem', textDecoration: 'underline' }}>Update Profile</Link>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;