import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Building2,
  MapPin,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';
import PasswordStrengthIndicator, { isStrongPassword } from '../components/PasswordStrengthIndicator';

const StudentProfilePage = () => {
  useDocumentTitle('My Student Profile');
  const { user, updateUser } = useAuth();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [avatarMsg, setAvatarMsg] = useState({ type: '', text: '' });

  // Sync state whenever auth user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  // Load student's complaint statistics
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints/my');
        if (res.data?.success && Array.isArray(res.data.complaints)) {
          const list = res.data.complaints;
          setStats({
            total: list.length,
            pending: list.filter((c) => c.status === 'Pending').length,
            inProgress: list.filter((c) => c.status === 'In Progress').length,
            resolved: list.filter((c) => c.status === 'Resolved').length,
          });
        }
      } catch (err) {
        console.warn('Could not load complaint stats:', err);
      }
    };
    fetchComplaints();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar Photo Upload Handler
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarMsg({ type: 'error', text: 'Please select a valid image file (PNG, JPG, JPEG, WEBP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ type: 'error', text: 'Photo size must be less than 5MB.' });
      return;
    }

    setAvatarLoading(true);
    setAvatarMsg({ type: '', text: '' });

    try {
      const uploadData = new FormData();
      uploadData.append('avatar', file);

      const res = await api.post('/auth/profile/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        updateUser(res.data.user || { avatar: res.data.avatar });
        setAvatarMsg({ type: 'success', text: 'Profile photo updated successfully!' });
      } else {
        setAvatarMsg({ type: 'error', text: res.data?.message || 'Failed to update photo.' });
      }
    } catch (err) {
      setAvatarMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error uploading profile photo.',
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove Avatar Handler
  const handleRemoveAvatar = async () => {
    if (!user?.avatar) return;
    setAvatarLoading(true);
    setAvatarMsg({ type: '', text: '' });

    try {
      const res = await api.delete('/auth/profile/avatar');
      if (res.data?.success) {
        updateUser(res.data.user || { avatar: '' });
        setAvatarMsg({ type: 'success', text: 'Profile photo removed.' });
      } else {
        setAvatarMsg({ type: 'error', text: res.data?.message || 'Failed to remove photo.' });
      }
    } catch (err) {
      setAvatarMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error removing profile photo.',
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  // Save Profile Details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!formData.name.trim()) {
      setProfileMsg({ type: 'error', text: 'Full Name cannot be empty.' });
      return;
    }

    setSaveLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
      });

      if (res.data?.success) {
        updateUser(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile information updated successfully!' });
      } else {
        setProfileMsg({ type: 'error', text: res.data?.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error saving profile details.',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match. Please re-enter.' });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordMsg({
        type: 'error',
        text: 'New password must be strong: at least 8 characters with uppercase, lowercase, number, and special symbol.',
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        currentPassword,
        newPassword,
      });

      if (res.data?.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully changed!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        setPasswordMsg({ type: 'error', text: res.data?.message || 'Failed to change password.' });
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Student Profile & Dossier"
      subtitle="Manage your campus credentials, personal photo, and university standing"
    >
      <div style={{ maxWidth: 940, margin: '0 auto' }}>
        {/* Profile Dossier Header Card */}
        <div
          className="dashboard-card"
          style={{
            padding: '2rem 1.75rem',
            marginBottom: '1.75rem',
            background: '#ffffff',
            border: '1px solid #e4e4e7',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            {/* Avatar & Student Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: '#09090b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '2rem',
                    letterSpacing: '1px',
                    border: '3px solid #ffffff',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                    overflow: 'hidden',
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>

                {/* Quick Camera Action Badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#18181b',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                  title="Upload profile photo"
                >
                  <Camera size={15} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.5rem', color: '#09090b', fontWeight: 800, margin: 0 }}>
                    {user?.name}
                  </h2>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                    }}
                  >
                    <ShieldCheck size={13} />
                    <span>Verified Student</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#71717a', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace', fontWeight: 700, color: '#18181b' }}>
                    <CreditCard size={14} color="#71717a" />
                    ID: {user?.studentId}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} />
                    {user?.email}
                  </span>
                  {user?.department && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#09090b', fontWeight: 550 }}>
                        <Building2 size={14} />
                        {user.department}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* DP Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                style={{ display: 'none' }}
                onChange={handleAvatarFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px' }}
              >
                <Camera size={15} />
                <span>{avatarLoading ? 'Uploading...' : user?.avatar ? 'Change Photo' : 'Upload Photo'}</span>
              </button>

              {user?.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={avatarLoading}
                  className="btn btn-outline btn-sm"
                  style={{ borderRadius: '8px', color: '#dc2626', borderColor: '#fca5a5' }}
                  title="Remove photo"
                >
                  <Trash2 size={15} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {avatarMsg.text && (
            <div
              className={`alert ${avatarMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}
              style={{ marginTop: '1.25rem', marginBottom: 0 }}
            >
              {avatarMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{avatarMsg.text}</span>
            </div>
          )}
        </div>

        {/* Real-time Grievance Metric Strip */}
        <div className="metric-grid" style={{ marginBottom: '1.75rem' }}>
          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Grievances Lodged</span>
              <div className="metric-icon-box metric-dark">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="metric-value">{stats.total}</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Under Triage</span>
              <div className="metric-icon-box metric-amber">
                <Calendar size={18} />
              </div>
            </div>
            <div className="metric-value">{stats.pending}</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Technician Dispatched</span>
              <div className="metric-icon-box metric-purple">
                <Building2 size={18} />
              </div>
            </div>
            <div className="metric-value">{stats.inProgress}</div>
          </div>

          <div className="metric-card">
            <div className="metric-card-top">
              <span className="metric-label">Resolved Tickets</span>
              <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="metric-value">{stats.resolved}</div>
          </div>
        </div>

        {/* 2-Column Section: Editable Profile & Security */}
        <div className="profile-grid-2col">
          {/* Card 1: Personal & Campus Profile Details */}
          <div className="dashboard-card" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: '16px' }}>
            <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f4f4f5', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#09090b', fontWeight: 700, margin: 0 }}>
                Personal & Campus Information
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#71717a', margin: '4px 0 0' }}>
                Update your contact information and campus department
              </p>
            </div>

            {profileMsg.text && (
              <div
                className={`alert ${profileMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}
                style={{ marginBottom: '1.25rem' }}
              >
                {profileMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">
                  Full Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your legal full name"
                    required
                  />
                </div>
              </div>

              {/* Student ID & Email (Strictly Read-Only For Integrity) */}
              <div className="form-grid-2col" style={{ gap: '0.85rem', marginBottom: '1.15rem' }}>
                <div>
                  <label className="form-label">Student Identification (Roll No)</label>
                  <div className="input-with-icon">
                    <CreditCard size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      value={user?.studentId || ''}
                      disabled
                      style={{ background: '#f4f4f5', color: '#71717a', cursor: 'not-allowed', fontFamily: 'monospace', fontWeight: 700 }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px', display: 'block' }}>
                    Assigned upon university enrollment
                  </span>
                </div>

                <div>
                  <label className="form-label">Account Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-control"
                      value={user?.email || ''}
                      disabled
                      style={{ background: '#f4f4f5', color: '#71717a', cursor: 'not-allowed' }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px', display: 'block' }}>
                    Verified campus communication address
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">Mobile / WhatsApp Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 555-019-2834"
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#71717a', marginTop: '2px', display: 'block' }}>
                  Used for technician SMS / WhatsApp dispatch alerts
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">Academic Department / Faculty</label>
                <div className="input-with-icon">
                  <Building2 size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science & Software Engineering"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Campus Residence / Hostel / Bio</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-control"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="e.g. Hostel Block B, Room 314"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg full-width"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card 2: Password & Account Security */}
          <div className="dashboard-card" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: '16px', height: 'fit-content' }}>
            <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f4f4f5', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#09090b', fontWeight: 700, margin: 0 }}>
                Security & Password
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#71717a', margin: '4px 0 0' }}>
                Update your login credentials securely
              </p>
            </div>

            {passwordMsg.text && (
              <div
                className={`alert ${passwordMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}
                style={{ marginBottom: '1.25rem' }}
              >
                {passwordMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">Current Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Create a strong password (8+ chars)"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={passwordData.newPassword} showOnlyWhenTyping={true} />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="form-control"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-outline btn-lg full-width"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfilePage;
