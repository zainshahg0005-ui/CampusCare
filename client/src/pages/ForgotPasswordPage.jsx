import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
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
import useOtpTimer from '../hooks/useOtpTimer';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PasswordStrengthIndicator, { isStrongPassword } from '../components/PasswordStrengthIndicator';

const ForgotPasswordPage = () => {
  useDocumentTitle('Password Recovery');
  const [step, setStep] = useState(1); // 1 = request code, 2 = verify & set password
  const [method, setMethod] = useState('email'); // 'email' | 'whatsapp'
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [destinationLabel, setDestinationLabel] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { secondsLeft, canResend, formattedTime, startTimer } = useOtpTimer(60);
  const navigate = useNavigate();

  // Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!identifier.trim()) {
      setError(
        method === 'whatsapp'
          ? 'Please enter your registered WhatsApp / Mobile number.'
          : 'Please enter your registered account email address.'
      );
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', {
        identifier: identifier.trim(),
        email: method === 'email' ? identifier.trim().toLowerCase() : undefined,
        phone: method === 'whatsapp' ? identifier.trim() : undefined,
        method,
      });

      if (res.data?.success) {
        setDestinationLabel(res.data.destination || identifier.trim());
        setSuccess(res.data.message || 'Verification code dispatched!');
        setStep(2);
        startTimer(60);
      }
    } catch (err) {
      console.error('Request OTP error:', err);
      setError(
        err.response?.data?.message || 'Failed to dispatch verification code. Please verify your details.'
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

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError('Please choose a stronger password meeting all security requirements below (8+ characters, uppercase, lowercase, number, and symbol).');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/reset-password', {
        identifier: identifier.trim(),
        email: method === 'email' ? identifier.trim().toLowerCase() : undefined,
        phone: method === 'whatsapp' ? identifier.trim() : undefined,
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
        <div className="auth-card" style={{ maxWidth: '440px' }}>
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
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp}>
              {/* Delivery Method Selector (Email vs WhatsApp) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Recovery Delivery Channel <span className="required">*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setError('');
                    }}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 8,
                      border: '2px solid #09090b',
                      background: '#f4f4f5',
                      color: '#09090b',
                      fontSize: '0.825rem',
                      fontWeight: 700,
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

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button
                      type="button"
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.5rem',
                        borderRadius: 8,
                        border: '1px solid #e4e4e7',
                        background: '#f4f4f5',
                        color: '#a1a1aa',
                        fontSize: '0.825rem',
                        fontWeight: 500,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageSquare size={15} />
                      <span>WhatsApp Code</span>
                    </button>
                    <span style={{ fontSize: '11px', color: '#71717a', marginTop: '4px', fontWeight: 600 }}>Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Input based on Selected Method */}
              {method === 'email' ? (
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
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">We'll dispatch a 6-digit recovery OTP to this email address</span>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Registered WhatsApp / Mobile Number <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      id="phone"
                      type="tel"
                      className="form-control"
                      placeholder="+1 555-019-2834 or +92 300 1234567"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                  <span className="form-hint">Enter your enrolled mobile/WhatsApp number with country code</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary full-width btn-lg"
                style={{ marginTop: '0.75rem', marginBottom: '1rem' }}
              >
                <span>
                  {loading
                    ? 'Dispatching Code...'
                    : `Send ${method === 'whatsapp' ? 'WhatsApp' : 'Email'} Code`}
                </span>
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
                    autoFocus
                    className="form-control"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      letterSpacing: '6px',
                      fontSize: '18px',
                      fontWeight: 700,
                      textAlign: 'center',
                    }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                    Code sent to {destinationLabel}. Valid for 10 mins.
                  </span>
                  <button
                    type="button"
                    disabled={!canResend || loading}
                    onClick={handleRequestOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: canResend ? '#09090b' : '#a1a1aa',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: canResend ? 'pointer' : 'not-allowed',
                      textDecoration: canResend ? 'underline' : 'none',
                      padding: 0,
                    }}
                  >
                    {canResend ? 'Resend Code' : `Resend in ${formattedTime}`}
                  </button>
                </div>
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
                    placeholder="Create a strong password (8+ chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <PasswordStrengthIndicator password={newPassword} showOnlyWhenTyping={true} />
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
                className="btn btn-primary full-width btn-lg"
                style={{ marginTop: '0.75rem', marginBottom: '1rem' }}
              >
                <span>{loading ? 'Updating Password...' : 'Reset Password & Proceed'}</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Change {method === 'whatsapp' ? 'Phone Number' : 'Email'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
            Remembered your credentials? <Link to="/login">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
