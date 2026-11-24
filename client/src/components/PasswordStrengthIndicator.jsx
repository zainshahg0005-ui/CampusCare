import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export const checkPasswordStrength = (password = '') => {
  const pwd = String(password || '');
  const checks = {
    length: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const isStrong = score === 5;

  let label = 'Weak';
  let color = '#ef4444'; // red
  if (score === 0) {
    label = '';
    color = '#cbd5e1';
  } else if (score <= 2) {
    label = 'Weak';
    color = '#ef4444';
  } else if (score === 3 || score === 4) {
    label = 'Moderate';
    color = '#f59e0b'; // amber
  } else if (score === 5) {
    label = 'Strong';
    color = '#10b981'; // emerald
  }

  return {
    ...checks,
    score,
    isStrong,
    label,
    color,
  };
};

export const isStrongPassword = (password = '') => {
  return checkPasswordStrength(password).isStrong;
};

const PasswordStrengthIndicator = ({ password = '', showOnlyWhenTyping = false }) => {
  if (showOnlyWhenTyping && !password) return null;

  const strength = checkPasswordStrength(password);
  const { length, hasUpper, hasLower, hasNumber, hasSpecial, score, label, color } = strength;

  const rules = [
    { label: 'At least 8 characters', valid: length },
    { label: 'One uppercase letter (A-Z)', valid: hasUpper },
    { label: 'One lowercase letter (a-z)', valid: hasLower },
    { label: 'One number (0-9)', valid: hasNumber },
    { label: 'One special symbol (!@#$%^&*)', valid: hasSpecial },
  ];

  return (
    <div
      style={{
        marginTop: '0.65rem',
        padding: '0.75rem 0.85rem',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        border: '1px solid #e4e4e7',
        fontSize: '0.8rem',
      }}
    >
      {/* Strength Bar & Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Password Strength
        </span>
        {label && (
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>
            {label}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', height: '5px', marginBottom: '0.75rem' }}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            style={{
              flex: 1,
              height: '100%',
              borderRadius: '2px',
              backgroundColor: level <= score ? color : '#e2e8f0',
              transition: 'background-color 0.25s ease',
            }}
          />
        ))}
      </div>

      {/* Rules Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.35rem' }}>
        {rules.map((rule, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: rule.valid ? '#166534' : '#71717a',
              fontWeight: rule.valid ? 600 : 400,
              fontSize: '0.75rem',
              transition: 'color 0.2s ease',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: rule.valid ? '#bbf7d0' : '#e4e4e7',
                color: rule.valid ? '#15803d' : '#a1a1aa',
                flexShrink: 0,
              }}
            >
              {rule.valid ? <Check size={10} strokeWidth={3} /> : <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#a1a1aa' }} />}
            </div>
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
