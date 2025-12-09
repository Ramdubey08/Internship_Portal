import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'student'
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const password = watch('password');
  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    const result = await registerUser(data);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(JSON.stringify(result.error));
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper register-wrapper">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <span className="brand-icon">🚀</span>
              <h1 className="brand-title">InternHub</h1>
            </div>
            <h2 className="brand-tagline">Start Your Journey!</h2>
            <p className="brand-description">
              Join thousands of students and companies already using InternHub to connect and grow.
            </p>
            <div className="brand-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5K+</div>
                <div className="stat-label">Internships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form-section">
          <div className="auth-form-container register-form">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Fill in your details to get started</p>
            </div>
            
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.username ? 'input-error' : ''}`}
                    placeholder="Choose a username"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && (
                    <span className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📧</span>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="your.email@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">I am a:</label>
                <div className="role-selection">
                  <label className={`role-card ${role === 'student' ? 'role-active' : ''}`}>
                    <input
                      type="radio"
                      value="student"
                      {...register('role')}
                      className="role-input"
                    />
                    <div className="role-content">
                      <span className="role-icon">🎓</span>
                      <span className="role-title">Student</span>
                      <span className="role-desc">Looking for internships</span>
                    </div>
                  </label>
                  <label className={`role-card ${role === 'company' ? 'role-active' : ''}`}>
                    <input
                      type="radio"
                      value="company"
                      {...register('role')}
                      className="role-input"
                    />
                    <div className="role-content">
                      <span className="role-icon">🏢</span>
                      <span className="role-title">Company</span>
                      <span className="role-desc">Hiring interns</span>
                    </div>
                  </label>
                </div>
              </div>

              {role === 'company' && (
                <div className="form-group company-field">
                  <label className="form-label">
                    <span className="label-icon">🏢</span>
                    <span>Company Name</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.company_name ? 'input-error' : ''}`}
                    placeholder="Enter your company name"
                    {...register('company_name', { 
                      required: role === 'company' ? 'Company name is required' : false 
                    })}
                  />
                  {errors.company_name && (
                    <span className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.company_name.message}
                    </span>
                  )}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔒</span>
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Min. 6 characters"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  {errors.password && (
                    <span className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔒</span>
                    <span>Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    className={`form-input ${errors.password2 ? 'input-error' : ''}`}
                    placeholder="Confirm password"
                    {...register('password2', { 
                      required: 'Please confirm password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  {errors.password2 && (
                    <span className="error-message">
                      <span className="error-icon">⚠️</span>
                      {errors.password2.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">✏️</span>
                    <span>First Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="First name"
                    {...register('first_name')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">✏️</span>
                    <span>Last Name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Last name"
                    {...register('last_name')}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit" 
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating Account...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="success-icon">✅</span>
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                Already have an account?
                <Link to="/login" className="footer-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
