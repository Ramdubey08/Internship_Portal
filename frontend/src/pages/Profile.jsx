import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

const ProfileEdit = () => {
  const { profile, updateProfile, user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setValue('bio', profile.bio || '');
      setValue('skills', profile.skills || '');
      setValue('company_name', profile.company_name || '');
      setValue('phone', profile.phone || '');
      setValue('college', profile.college || '');
      setValue('degree', profile.degree || '');
      setValue('graduation_year', profile.graduation_year || '');
      setValue('github', profile.github || '');
      setValue('linkedin', profile.linkedin || '');
      setValue('portfolio', profile.portfolio || '');
    }
  }, [profile, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    
    const result = await updateProfile(data);
    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(JSON.stringify(result.error) || 'Failed to update profile');
    }
    
    setLoading(false);
    
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="container mt-2">
      <h1>My Profile</h1>

      <div className="grid mt-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card">
          <h2>Account Information</h2>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Username:</strong></p>
            <p>{user?.username || profile?.user?.username}</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Email:</strong></p>
            <p>{user?.email || profile?.user?.email}</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Full Name:</strong></p>
            <p>{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Not provided'}</p>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Account Type:</strong></p>
            <p style={{ textTransform: 'capitalize', color: '#3498db', fontWeight: 'bold' }}>
              {profile?.role}
            </p>
          </div>
          {profile?.role === 'student' && profile?.phone && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Phone:</strong></p>
              <p>{profile.phone}</p>
            </div>
          )}
          {profile?.role === 'student' && profile?.college && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>College:</strong></p>
              <p>{profile.college}</p>
            </div>
          )}
          {profile?.role === 'student' && profile?.degree && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Degree:</strong></p>
              <p>{profile.degree}</p>
            </div>
          )}
          {profile?.role === 'student' && profile?.graduation_year && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Graduation Year:</strong></p>
              <p>{profile.graduation_year}</p>
            </div>
          )}
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Member Since:</strong></p>
            <p>{new Date(user?.date_joined || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="card">
          <h2>Edit Profile</h2>
          
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {profile?.role === 'company' && (
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  {...register('company_name', { required: 'Company name is required for company profiles' })}
                  placeholder="Your Company Name"
                />
                {errors.company_name && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.company_name.message}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Bio</label>
              <textarea
                {...register('bio')}
                rows="5"
                placeholder={profile?.role === 'student' ? 'Tell us about yourself, your interests, and career goals...' : 'Describe your company, culture, and what makes it a great place to intern...'}
              />
            </div>

            {profile?.role === 'student' && (
              <>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', { pattern: { value: /^[0-9]{10,15}$/, message: 'Enter valid phone number' } })}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label>College/University</label>
                  <input
                    type="text"
                    {...register('college')}
                    placeholder="e.g., IIT Delhi, Mumbai University"
                  />
                </div>

                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Degree/Course</label>
                    <input
                      type="text"
                      {...register('degree')}
                      placeholder="e.g., B.Tech Computer Science, BBA"
                    />
                  </div>

                  <div className="form-group">
                    <label>Graduation Year</label>
                    <input
                      type="number"
                      {...register('graduation_year', { min: 2020, max: 2030 })}
                      placeholder="2025"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>GitHub Profile</label>
                  <input
                    type="url"
                    {...register('github', { pattern: { value: /^https?:\/\/.+/, message: 'Enter valid URL' } })}
                    placeholder="https://github.com/yourusername"
                  />
                  {errors.github && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.github.message}</span>}
                </div>

                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input
                    type="url"
                    {...register('linkedin', { pattern: { value: /^https?:\/\/.+/, message: 'Enter valid URL' } })}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                  {errors.linkedin && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.linkedin.message}</span>}
                </div>

                <div className="form-group">
                  <label>Portfolio Website</label>
                  <input
                    type="url"
                    {...register('portfolio', { pattern: { value: /^https?:\/\/.+/, message: 'Enter valid URL' } })}
                    placeholder="https://yourportfolio.com"
                  />
                  {errors.portfolio && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.portfolio.message}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label>Skills {profile?.role === 'student' && '*'}</label>
              <input
                type="text"
                {...register('skills', profile?.role === 'student' ? { required: 'Skills are required for students' } : {})}
                placeholder="e.g., React, Python, Data Analysis, Marketing (comma-separated)"
              />
              {errors.skills && <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.skills.message}</span>}
              <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                Separate skills with commas
              </small>
            </div>

            <div className="form-group">
              <label>
                {profile?.role === 'student' ? 'Resume (CV)' : 'Company Logo'}
              </label>
              <input
                type="file"
                accept={profile?.role === 'student' ? '.pdf,.doc,.docx' : 'image/*'}
                style={{ border: '1px dashed #ddd', padding: '1rem' }}
              />
              <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
                {profile?.role === 'student' ? 'Upload your resume (PDF, DOC, DOCX - Max 5MB)' : 'Upload company logo (JPG, PNG - Max 2MB)'}
              </small>
            </div>

            <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {profile?.skills && (
        <div className="card mt-2">
          <h3>Your Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
            {profile.skills.split(',').map((skill, index) => (
              <span key={index} style={{ background: '#e3f2fd', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile?.role === 'student' && (profile?.github || profile?.linkedin || profile?.portfolio) && (
        <div className="card mt-2">
          <h3>Online Presence</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" 
                className="btn" style={{ background: '#333', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🐙</span> GitHub
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" 
                className="btn" style={{ background: '#0077b5', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💼</span> LinkedIn
              </a>
            )}
            {profile.portfolio && (
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" 
                className="btn" style={{ background: '#8b5cf6', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🌐</span> Portfolio
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEdit;
