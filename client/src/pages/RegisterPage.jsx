import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, studentId, email, password, confirmPassword } = formData;

    if (!name.trim() || !studentId.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
    });
    setLoading(false);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message);
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
            <h2>Student Registration</h2>
            <p>Create your student account to submit and track complaints</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="studentId">
                Student ID / Roll Number <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <CreditCard size={18} className="input-icon" />
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className="form-control"
                  placeholder="e.g. STU-2026-889"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <span className="form-hint">Official campus enrollment or matriculation identifier</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                University Email Address <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="e.g. alex@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
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
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Student Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
