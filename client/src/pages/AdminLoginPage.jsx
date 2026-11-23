import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  LockKeyhole,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminLoginPage = () => {
  useDocumentTitle('Admin Terminal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.success) {
      // Enforce strict Role-Based Access Control
      if (result.user.role !== 'admin') {
        logout(); // Revoke student token from admin terminal
        setError('Access Denied: This terminal is strictly for university administration staff. Please use the Student Login portal.');
        return;
      }
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid administrator credentials.');
    }
  };

  return (
    <div>
      <PublicNavbar />
      <div className="auth-wrapper" style={{ background: '#fafafa' }}>
        <div className="auth-card" style={{ border: '1px solid #18181b', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <div className="auth-header">
            <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.85rem' }}>
              <div className="brand-icon-box" style={{ background: '#09090b' }}>
                <Shield size={22} color="#ffffff" />
              </div>
              <span className="brand-text">
                Admin<span className="brand-accent">Terminal</span>
              </span>
            </div>
            <h2>Facility Administration</h2>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '0.2rem 0.6rem',
                borderRadius: 4,
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                fontSize: '0.725rem',
                fontWeight: 600,
                color: '#18181b',
                marginTop: 4,
              }}
            >
              <LockKeyhole size={12} />
              <span>Restricted Staff Access Only</span>
            </div>
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
                Administrative Email <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="admin@campuscare.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" htmlFor="password" style={{ margin: 0 }}>
                  Security Key / Password <span className="required">*</span>
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
                  placeholder="Enter administrator password"
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
              <span>{loading ? 'Authenticating Staff...' : 'Access Command Cockpit'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-footer" style={{ marginTop: '1.75rem', borderTop: '1px solid #f4f4f5', paddingTop: '1.25rem' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#71717a',
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              <GraduationCap size={15} color="#09090b" />
              <span>Enrolled student? Access Student Portal →</span>
            </Link>
            <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: '#a1a1aa' }}>
              Authorized University Personnel &bull; <Link to="/terms" style={{ color: '#71717a' }}>Institutional Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
