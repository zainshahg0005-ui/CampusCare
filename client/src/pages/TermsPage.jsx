import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Lock, BellRing } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const TermsPage = () => {
  useDocumentTitle('Terms & Conditions');
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', color: 'var(--foreground)' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--card-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--foreground)',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--brand-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                C
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>
                CampusCare
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/register"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--foreground)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}
            >
              Register
            </Link>
            <Link
              to="/login"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'var(--brand-primary)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Document Content */}
      <main style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--muted)',
              marginBottom: '12px',
            }}
          >
            <FileText size={15} /> Institutional Operational Policy
          </div>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: '0 0 12px',
              color: 'var(--foreground)',
            }}
          >
            Terms & Conditions of Service
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
            Effective Date: November 2026 &bull; Governing all CampusCare student & administrative service interactions.
          </p>
        </div>

        {/* Highlight Card */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <ShieldCheck size={24} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--foreground)' }}>
            <strong>Commitment to Campus Integrity:</strong> CampusCare is the designated digital platform for managing institutional facilities, maintenance grievances, and safety repairs. By creating an account or accessing this service, you agree to comply with the terms set forth below.
          </div>
        </div>

        {/* Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section 1 */}
          <section
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--foreground)',
              }}
            >
              <CheckCircle2 size={18} /> 1. Student Identity & Verification
            </h2>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                &bull; Students must register using their official university enrollment details and a valid, personal or institutional email address. Temporary or disposable email accounts (e.g., mailinator, temp-mail) are strictly prohibited and automatically blocked.
              </p>
              <p style={{ margin: 0 }}>
                &bull; Each student is permitted a single active account tied to their university Student ID. Sharing credentials, delegating ticket submissions under assumed identities, or proxy submissions is a violation of university digital policies.
              </p>
              <p style={{ margin: 0 }}>
                &bull; All new registrations are subject to multi-factor 6-digit OTP verification delivered to the user's registered communication channels before access is authorized.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--foreground)',
              }}
            >
              <AlertTriangle size={18} /> 2. Truthful & Responsible Grievance Submissions
            </h2>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                &bull; Grievance submissions must represent authentic, observable facility or service deficiencies requiring university intervention (such as electrical hazards, laboratory safety, HVAC, plumbing, or classroom fixtures).
              </p>
              <p style={{ margin: 0 }}>
                &bull; Frivolous, fabricated, or automated ticket spamming that impedes maintenance dispatch schedules is monitored and subject to immediate administrative review and disciplinary referral.
              </p>
              <p style={{ margin: 0 }}>
                &bull; Photographic attachments submitted alongside tickets must be directly related to the reported issue. Uploads containing inappropriate, defamatory, or non-maintenance media will be discarded.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--foreground)',
              }}
            >
              <BellRing size={18} /> 3. Notification & Communication Protocols
            </h2>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                &bull; By registering, students consent to receive transactional system alerts, including 6-digit authentication OTPs, maintenance dispatch notifications, technician notes, and ticket resolution confirmations.
              </p>
              <p style={{ margin: 0 }}>
                &bull; Notifications may be dispatched via email or optional WhatsApp communication according to student account settings. CampusCare does not transmit promotional or marketing spam.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--foreground)',
              }}
            >
              <Lock size={18} /> 4. Data Privacy & Account Security
            </h2>
            <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0 }}>
                &bull; All student credentials and sensitive authentication parameters are securely hashed using industry-standard bcrypt algorithms. Passwords are never stored in plaintext.
              </p>
              <p style={{ margin: 0 }}>
                &bull; Student data is utilized exclusively for institutional maintenance tracking and will never be monetized, distributed, or released to third-party data aggregators.
              </p>
              <p style={{ margin: 0 }}>
                &bull; Students remain responsible for preserving the confidentiality of their session tokens and passwords. In the event of suspected unauthorized account access, students must immediately initiate a password reset.
              </p>
            </div>
          </section>
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--muted)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>&copy; {new Date().getFullYear()} CampusCare Facilities Management. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
            <Link to="/register" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
            <Link to="/login" style={{ color: 'var(--foreground)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
