import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const result = await login(data);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <span className="brand-icon">🚀</span>
              <h1 className="brand-title">InternHub</h1>
            </div>
            <h2 className="brand-tagline">Welcome Back!</h2>
            <p className="brand-description">
              Sign in to access thousands of internship opportunities and take the next step in your career journey.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Premium Internships</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Easy Application</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="form-header">
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to continue</p>
            </div>
            
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  <span>Username</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.username ? 'input-error' : ''}`}
                  placeholder="Enter your username"
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
                  <span className="label-icon">🔒</span>
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <span className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-submit" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                Don't have an account?
                <Link to="/register" className="footer-link">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
