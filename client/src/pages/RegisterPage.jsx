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
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../layouts/PublicNavbar';

const RegisterPage = () => {
  const [step, setStep] = useState('form'); // 'form' | 'verify'
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
  const [receivedOtp, setReceivedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const { register, verifyRegistrationOtp, resendRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  // Cooldown countdown for resending OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // STEP 1: Registration Form Submission (Button: "Register")
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { name, studentId, email, phone, password, confirmPassword, agreeTerms } = formData;

    if (!name.trim() || !studentId.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions to register.');
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
      // Transition to separate OTP Screen
      setStep('verify');
      setOtpSent(true);
      setTimer(60);
      if (result.code) {
        setReceivedOtp(result.code);
      }
      setSuccessMsg(result.message || 'Registration recorded. Please verify your account with the OTP code.');
    } else {
      setError(result.message || 'Registration failed. Please check your information.');
    }
  };

  // STEP 2 - Action 1: Send / Resend OTP (Button: "Send OTP")
  const handleSendOtp = async () => {
    if (sendingOtp || timer > 0) return;
    setError('');
    setSuccessMsg('');
    setSendingOtp(true);

    const result = await resendRegistrationOtp({
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      method,
    });
    setSendingOtp(false);

    if (result.success) {
      setOtpSent(true);
      setTimer(60);
      if (result.code) {
        setReceivedOtp(result.code);
      }
      setSuccessMsg(result.message || 'Verification code sent! Please check your messages.');
    } else {
      setError(result.message || 'Failed to dispatch verification code. Please try again.');
    }
  };

  // STEP 2 - Action 2: Verify OTP (Button: "Verify")
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the 6-digit verification code.');
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

  const autoFillOtp = () => {
    if (receivedOtp) {
      setOtp(receivedOtp);
      setError('');
    }
  };

  const destinationText =
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
            <h2>{step === 'verify' ? 'Account Verification' : 'Student Registration'}</h2>
            <p>
              {step === 'verify'
                ? 'Get your 6-digit security code and verify your student account'
                : 'Create your verified student account to report and track complaints'}
            </p>
          </div>

          {/* Feedback Alerts */}
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

          {/* ========================================================================= */}
          {/* SCREEN 1: Registration Form with Button "Register" */}
          {/* ========================================================================= */}
          {step === 'form' ? (
            <form onSubmit={handleRegister}>
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

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  WhatsApp / Mobile Number <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(Optional)</span>
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
                  />
                </div>
                <span className="form-hint">Receive WhatsApp maintenance progress and OTP alerts</span>
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

              {/* Terms Checkbox */}
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

              {/* Required Exact Button: "Register" */}
              <button
                type="submit"
                className="btn btn-primary full-width btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                    <span>Registering Account...</span>
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          ) : (
            /* ========================================================================= */
            /* SCREEN 2: Separate Screen with "Send OTP" and "Verify" Buttons            */
            /* ========================================================================= */
            <div>
              {/* Account Overview Box */}
              <div
                style={{
                  background: '#fafafa',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '1.25rem',
                  fontSize: '13px',
                }}
              >
                <div style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>
                  Student Account
                </div>
                <div style={{ fontWeight: 700, color: '#09090b', marginBottom: '2px' }}>
                  {formData.name} ({formData.studentId})
                </div>
                <div style={{ color: '#52525b', fontSize: '12px' }}>
                  {formData.email} {formData.phone ? `• ${formData.phone}` : ''}
                </div>
              </div>

              {/* Delivery Channel Picker (if phone is provided) */}
              {formData.phone && (
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block', fontSize: '12px' }}>
                    Select OTP Delivery Destination
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setMethod('email')}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 6,
                        border: method === 'email' ? '2px solid #09090b' : '1px solid #e4e4e7',
                        background: method === 'email' ? '#f4f4f5' : '#ffffff',
                        color: '#09090b',
                        fontSize: '12px',
                        fontWeight: method === 'email' ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Mail size={14} /> Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('whatsapp')}
                      style={{
                        padding: '0.5rem',
                        borderRadius: 6,
                        border: method === 'whatsapp' ? '2px solid #09090b' : '1px solid #e4e4e7',
                        background: method === 'whatsapp' ? '#f4f4f5' : '#ffffff',
                        color: '#09090b',
                        fontSize: '12px',
                        fontWeight: method === 'whatsapp' ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                  </div>
                </div>
              )}

              {/* Action 1: Button "Send OTP" */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || timer > 0}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: 8,
                    border: '1px solid #18181b',
                    background: timer > 0 ? '#f4f4f5' : '#18181b',
                    color: timer > 0 ? '#71717a' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: timer > 0 || sendingOtp ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Send size={15} />
                  <span>
                    {sendingOtp
                      ? 'Dispatching Code...'
                      : timer > 0
                      ? `OTP Dispatched (Resend in ${timer}s)`
                      : otpSent
                      ? 'Send OTP Again'
                      : 'Send OTP'}
                  </span>
                </button>
              </div>

              {/* Demo Mode Code Badge (Allows testing without configured SMTP) */}
              {receivedOtp && (
                <div
                  onClick={autoFillOtp}
                  style={{
                    marginBottom: '1.25rem',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#09090b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  title="Click to auto-fill code"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} color="#ffffff" />
                    <span style={{ fontSize: '13px' }}>
                      Verification Code: <strong style={{ letterSpacing: '2px', fontSize: '15px' }}>{receivedOtp}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', textDecoration: 'underline', color: '#a1a1aa' }}>
                    Auto-fill →
                  </span>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleVerify}>
                <div className="form-group">
                  <label className="form-label" htmlFor="otp">
                    Enter 6-Digit OTP Code <span className="required">*</span>
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
                    Check your {method === 'whatsapp' ? 'WhatsApp' : 'Email'} ({destinationText}) for the 6-digit code.
                  </span>
                </div>

                {/* Required Exact Button: "Verify" */}
                <button
                  type="submit"
                  className="btn btn-primary full-width btn-lg"
                  disabled={loading || otp.length < 6}
                  style={{ marginTop: '0.75rem' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>

                {/* Back to Edit Details */}
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
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
                      fontSize: '13px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={14} /> Back to Edit Registration
                  </button>
                </div>
              </form>
            </div>
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
