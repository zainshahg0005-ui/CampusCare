import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  MapPin,
  Tag,
  Clock,
  AlertTriangle,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ComplaintDrawer = ({ complaint, isOpen, onClose, onComplaintUpdated }) => {
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [adminStatus, setAdminStatus] = useState(complaint?.status || 'Pending');
  const [adminRemarks, setAdminRemarks] = useState(complaint?.adminResponse || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleCopyId = () => {
    const idToCopy = complaint.ticketId || complaint._id;
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepStatus = (stepIndex) => {
    // 0: Submitted, 1: Triaged, 2: In Progress, 3: Resolved
    const status = complaint.status;
    if (status === 'Rejected') {
      return stepIndex === 0 ? 'completed' : 'rejected';
    }
    if (status === 'Resolved') return 'completed';
    if (status === 'In Progress') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'active';
      return 'pending';
    }
    // Pending
    if (stepIndex === 0) return 'completed';
    if (stepIndex === 1) return 'active';
    return 'pending';
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.patch(`/admin/complaints/${complaint._id}/status`, {
        status: adminStatus,
        adminResponse: adminRemarks,
      });
      if (res.data?.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 2500);
        if (onComplaintUpdated) {
          onComplaintUpdated(res.data.complaint);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update complaint. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const priorityStyles = {
    Urgent: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Urgent Priority' },
    High: { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', label: 'High Priority' },
    Medium: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', label: 'Medium Priority' },
    Low: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb', label: 'Standard Routine' },
  };

  const currentPriority = priorityStyles[complaint.priority] || priorityStyles.Medium;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}>
        <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="drawer-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: '#f3f4f6',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 6,
                    color: '#374151',
                  }}
                >
                  #{complaint.ticketId || complaint._id.slice(-6).toUpperCase()}
                </span>
                <button
                  onClick={handleCopyId}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: copied ? '#059669' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: '0.75rem',
                  }}
                  title="Copy Ticket ID"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <h2 style={{ fontSize: '1.15rem', color: '#111827', margin: 0 }}>
                {complaint.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f3f4f6',
                border: 'none',
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#4b5563',
              }}
              title="Close Panel (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="drawer-body">
            {/* 4-Stage Lifecycle Stepper */}
            <div className="stepper-container">
              <div className="stepper-title">Ticket Lifecycle Status</div>
              <div className="stepper-track">
                {/* Step 1 */}
                <div className="stepper-step">
                  <div className={`step-circle ${getStepStatus(0)}`}>
                    1
                  </div>
                  <span className={`step-label ${getStepStatus(0)}`}>Filed</span>
                </div>

                {/* Step 2 */}
                <div className="stepper-step">
                  <div className={`step-circle ${getStepStatus(1)}`}>
                    2
                  </div>
                  <span className={`step-label ${getStepStatus(1)}`}>Triaged</span>
                </div>

                {/* Step 3 */}
                <div className="stepper-step">
                  <div className={`step-circle ${getStepStatus(2)}`}>
                    3
                  </div>
                  <span className={`step-label ${getStepStatus(2)}`}>In Progress</span>
                </div>

                {/* Step 4 */}
                <div className="stepper-step">
                  <div className={`step-circle ${getStepStatus(3)}`}>
                    4
                  </div>
                  <span className={`step-label ${getStepStatus(3)}`}>Resolved</span>
                </div>
              </div>
            </div>

            {/* Meta Attributes Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                background: '#ffffff',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Tag size={16} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Category</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{complaint.category}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Location</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{complaint.location || 'Campus Wide'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={16} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Submitted</div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#111827' }}>{formatDate(complaint.createdAt)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={16} color={currentPriority.text} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase' }}>Severity / SLA</div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: currentPriority.text,
                      background: currentPriority.bg,
                      border: `1px solid ${currentPriority.border}`,
                      padding: '0.1rem 0.45rem',
                      borderRadius: 4,
                    }}
                  >
                    {currentPriority.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div style={{ background: '#f9fafb', padding: '1.25rem', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem' }}>
                Issue Description & Details
              </div>
              <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {complaint.description}
              </p>
            </div>

            {/* Photo Attachment View */}
            {complaint.photoUrl && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Inspection Photograph
                </div>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    maxHeight: 220,
                    cursor: 'pointer',
                  }}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint Evidence"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Maximize2 size={13} />
                    <span>Click to Expand</span>
                  </div>
                </div>
              </div>
            )}

            {/* Official Administrative Remarks */}
            <div
              style={{
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                borderRadius: 10,
                padding: '1.15rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={16} color="#18181b" />
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#18181b', textTransform: 'uppercase' }}>
                  Facilities Desk Response
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#3f3f46', lineHeight: 1.5, margin: 0 }}>
                {complaint.adminResponse || 'No official remarks added yet. Technician will update upon inspection.'}
              </p>
            </div>

            {/* Admin Management Action Box (If user has Admin role) */}
            {isAdmin && (
              <form
                onSubmit={handleAdminUpdate}
                style={{
                  background: '#ffffff',
                  border: '1px solid #09090b',
                  borderRadius: 12,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090b' }}>
                    Quick Dispatch & Status Update
                  </div>
                  {updateSuccess && (
                    <span style={{ fontSize: '0.75rem', color: '#18181b', fontWeight: 600 }}>
                      ✓ Updated Successfully
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: 4 }}>
                    New Status
                  </label>
                  <select
                    className="form-control"
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="Pending">Pending Triage</option>
                    <option value="In Progress">In Progress (Dispatched)</option>
                    <option value="Resolved">Resolved & Closed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: 4 }}>
                    Official Dispatch Notes
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="e.g. Electrician team dispatched to Block C, completed circuit repair."
                    style={{ fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
                >
                  {isUpdating ? 'Saving...' : 'Update Ticket'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && complaint.photoUrl && (
        <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <img
            src={complaint.photoUrl}
            alt="Expanded Evidence"
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              background: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} color="#111827" />
          </button>
        </div>
      )}
    </>
  );
};

export default ComplaintDrawer;
