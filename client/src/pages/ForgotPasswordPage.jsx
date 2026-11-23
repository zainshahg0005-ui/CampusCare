import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  MessageSquare,
} from 'lucide-react';
import PublicNavbar from '../layouts/PublicNavbar';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify & set password
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('email'); // 'email' | 'whatsapp'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please provide your registered account email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
        method,
      });

      if (res.data?.success) {
        setSuccess(res.data.message || 'Verification code sent!');
        setStep(2);
      }
    } catch (err) {
      console.error('Request OTP error:', err);
      setError(
        err.response?.data?.message || 'Failed to dispatch verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim() || !newPassword) {
      setError('Please enter the 6-digit code and your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.data?.success) {
        setSuccess('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch (err) {
      console.error('Reset Password error:', err);
      setError(
        err.response?.data?.message || 'Invalid or expired verification code. Please request a new one.'
      );
    } finally {
      setLoading(false);
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
                <ShieldCheck size={22} color="#ffffff" />
              </div>
              <span className="brand-text">
                Campus<span className="brand-accent">Care</span>
              </span>
            </div>
            <h2>Password Recovery</h2>
            <p>
              {step === 1
                ? 'Request a secure 6-digit code to reset your account credentials'
                : 'Enter your verification code and choose a new password'}
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Registered Account Email <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="student@campuscare.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Delivery Method Selector (Email vs WhatsApp) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Delivery Channel
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setMethod('email')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 8,
                      border: method === 'email' ? '2px solid #09090b' : '1px solid #e4e4e7',
                      background: method === 'email' ? '#f4f4f5' : '#ffffff',
                      color: '#09090b',
                      fontSize: '0.825rem',
                      fontWeight: method === 'email' ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Mail size={15} />
                    <span>Send via Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('whatsapp')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 8,
                      border: method === 'whatsapp' ? '2px solid #09090b' : '1px solid #e4e4e7',
                      background: method === 'whatsapp' ? '#f4f4f5' : '#ffffff',
                      color: '#09090b',
                      fontSize: '0.825rem',
                      fontWeight: method === 'whatsapp' ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageSquare size={15} />
                    <span>WhatsApp Code</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary full-width"
                style={{ marginBottom: '1rem' }}
              >
                <span>{loading ? 'Dispatching Code...' : 'Send Verification Code'}</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.825rem',
                    color: '#71717a',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="otp">
                  6-Digit Verification Code <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <KeyRound size={18} className="input-icon" />
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    className="form-control"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ fontFamily: 'monospace', letterSpacing: '4px', fontSize: '1.1rem' }}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.725rem', color: '#71717a' }}>
                  Code sent to {email} ({method === 'whatsapp' ? 'WhatsApp' : 'Email'}). Valid for 10 mins.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">
                  New Password <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm New Password <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary full-width"
                style={{ marginBottom: '1rem' }}
              >
                <span>{loading ? 'Resetting Password...' : 'Reset Password & Sign In'}</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setError('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    color: '#71717a',
                  }}
                >
                  ← Request a new verification code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
