import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Direct user based on role or intended destination
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/student/dashboard';
        navigate(from);
      }
    } else {
      setError(result.message);
    }
  };

  // Quick fill helper for testing/demonstration
  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@campuscare.edu');
      setPassword('Admin@12345');
    }
  };

  return (
    <div>
      <PublicNavbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.85rem' }}>
              <div className="brand-icon-box">
                <ShieldCheck size={24} color="#ffffff" />
              </div>
              <span className="brand-text">
                Campus<span className="brand-accent">Care</span>
              </span>
            </div>
            <h2>Sign In to CampusCare</h2>
            <p>Enter your credentials to access your portal</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="student@university.edu or admin@..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" htmlFor="password" style={{ margin: 0 }}>
                  Password <span className="required">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.775rem', color: '#71717a', textDecoration: 'underline' }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password view"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In to Account'
              )}
            </button>
          </form>

          {/* Demonstration Helper Box */}
          <div className="auth-demo-box">
            <div className="auth-demo-title">
              <Info size={15} />
              <span>Demonstration Tip</span>
            </div>
            <p>
              New student? Click "Register here" below to create an account.
            </p>
            <p style={{ marginTop: '0.35rem' }}>
              Want to test as Administrator? Run <code>npm run seed:admin</code> in the server folder, or{' '}
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                auto-fill default admin
              </button>
              .
            </p>
          </div>

          <div className="auth-footer">
            Don't have a student account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
