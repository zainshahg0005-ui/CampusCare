import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';

const RegisterPage = () => {
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [method, setMethod] = useState('email'); // 'email' | 'whatsapp'
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { register, verifyRegistrationOtp, resendRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  // Cooldown countdown for resending OTP
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Step 1: Submit Registration & Request OTP
  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { name, studentId, email, phone, password, confirmPassword, agreeTerms } = formData;

    if (!name.trim() || !studentId.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions to create an account.');
      return;
    }

    if (method === 'whatsapp' && (!phone || phone.trim().length < 7)) {
      setError('Please provide a valid WhatsApp / Mobile number (e.g. +1 555-019-2834 or +92 300 1234567) to receive your code on WhatsApp.');
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
      phone: phone.trim() || undefined,
      method,
      password,
      confirmPassword,
    });
    setLoading(false);

    if (result.success) {
      if (result.requiresOtp) {
        setStep('otp');
        setTimer(60);
        setCanResend(false);
        setSuccessMsg(result.message || `A 6-digit code was dispatched.`);
      } else {
        // Direct registration fallback
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message || 'Unable to register student account.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const result = await verifyRegistrationOtp({
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      otp: cleanOtp,
    });
    setLoading(false);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message || 'Invalid or expired verification code.');
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || resending) return;
    setError('');
    setSuccessMsg('');
    setResending(true);

    const result = await resendRegistrationOtp({
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      method,
    });
    setResending(false);

    if (result.success) {
      setSuccessMsg(result.message || 'A fresh verification code was dispatched.');
      setTimer(60);
      setCanResend(false);
    } else {
      setError(result.message || 'Failed to resend code. Please try again.');
    }
  };

  const destinationLabel =
    method === 'whatsapp' && formData.phone
      ? `WhatsApp (${formData.phone})`
      : formData.email;

  return (
    <div>
      <PublicNavbar />
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: '460px' }}>
          {/* Header */}
          <div className="auth-header">
            <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.85rem' }}>
              <div className="brand-icon-box">
                <ShieldCheck size={24} color="#ffffff" />
              </div>
              <span className="brand-text">
                Campus<span className="brand-accent">Care</span>
              </span>
            </div>
            <h2>{step === 'otp' ? 'Verify Your Account' : 'Student Registration'}</h2>
            <p>
              {step === 'otp'
                ? `Enter the 6-digit security code sent to ${destinationLabel}`
                : 'Create your verified student account to report and track complaints'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                color: '#18181b',
                fontSize: '13px',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={16} style={{ color: '#09090b', flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'form' ? (
            /* STEP 1: Registration Form */
            <form onSubmit={handleInitiateRegister}>
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
                <span className="form-hint">Official campus enrollment identifier</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  University / Personal Email <span className="required">*</span>
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

              {/* WhatsApp / Mobile Number Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  WhatsApp / Mobile Number {method === 'whatsapp' ? <span className="required">*</span> : <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(Optional)</span>}
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +1 555-019-2834 or +92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                    required={method === 'whatsapp'}
                  />
                </div>
                <span className="form-hint">
                  {method === 'whatsapp'
                    ? 'Required: Your 6-digit registration code will be sent here.'
                    : 'Optional: Used for maintenance SMS/WhatsApp alerts on your tickets.'}
                </span>
              </div>

              {/* Verification Channel Toggle */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Verification Code Delivery Channel <span className="required">*</span>
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
                    <span>Email OTP</span>
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
                    <span>WhatsApp OTP</span>
                  </button>
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

              {/* Terms and conditions agreement checkbox */}
              <div style={{ margin: '14px 0 18px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="agreeTerms"
                  style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.4, cursor: 'pointer' }}
                >
                  I have read and agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--foreground)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Terms & Conditions
                  </Link>{' '}
                  governing campus facilities and respectful grievance reporting.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary full-width btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                    <span>Dispatching {method === 'whatsapp' ? 'WhatsApp' : 'Email'} Code...</span>
                  </>
                ) : (
                  `Send ${method === 'whatsapp' ? 'WhatsApp' : 'Email'} Verification Code`
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: 6-Digit OTP Verification Form */
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label" htmlFor="otp">
                  6-Digit Verification Code <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <KeyRound size={18} className="input-icon" />
                  <input
                    id="otp"
                    name="otp"
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
                <span className="form-hint">
                  Valid for 15 minutes. Delivered via {method === 'whatsapp' ? 'WhatsApp message' : 'Email'}.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary full-width btn-lg"
                disabled={loading || otp.length < 6}
                style={{ marginTop: '1rem' }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  'Verify & Activate Account'
                )}
              </button>

              {/* Resend and Edit details controls */}
              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} /> Edit Details
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || resending}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResend ? 'var(--foreground)' : 'var(--muted)',
                    fontWeight: canResend ? 600 : 400,
                    cursor: canResend ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <RefreshCw size={13} className={resending ? 'spin' : ''} />
                  {resending
                    ? 'Resending...'
                    : canResend
                    ? 'Resend Code'
                    : `Resend in ${timer}s`}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
            Already have an account? <Link to="/login">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
