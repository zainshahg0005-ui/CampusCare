import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const LoginPage = () => {
  useDocumentTitle('Student Sign In');
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

    if (!email.trim() || !password) {
      setError('Please provide your enrolled student email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/student/dashboard';
        navigate(from);
      }
    } else {
      setError(result.message || 'Invalid student credentials provided.');
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
                <GraduationCap size={22} color="#ffffff" />
              </div>
              <span className="brand-text">
                Student<span className="brand-accent">Portal</span>
              </span>
            </div>
            <h2>Student Sign In</h2>
            <p>Access your campus grievances, maintenance logs, and live dispatch updates</p>
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
                Student Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="student@university.edu"
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
                  placeholder="Enter your student password"
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
              <span>{loading ? 'Authenticating...' : 'Sign In as Student'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '1.75rem', borderTop: '1px solid #f4f4f5', paddingTop: '1.25rem' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              Don't have an enrolled account? <Link to="/register">Register here</Link>
            </div>
            <div>
              <Link
                to="/admin/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#71717a',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 6,
                  border: '1px solid #e4e4e7',
                  background: '#fafafa',
                }}
              >
                <Shield size={14} color="#09090b" />
                <span>Administration Staff Login →</span>
              </Link>
            </div>
            <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
              Protected by CampusCare &bull; <Link to="/terms" style={{ color: '#71717a' }}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
