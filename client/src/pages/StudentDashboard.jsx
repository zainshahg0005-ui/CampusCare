import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  Clock,
  CheckCircle,
  Hourglass,
  XCircle,
  FileText,
  Eye,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  X,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ArrowUp,
  Layers,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/my');
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentComplaints(res.data.complaints.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge badge-pending"><span className="badge-dot"></span> Pending</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress"><span className="badge-dot"></span> In Progress</span>;
      case 'Resolved':
        return <span className="badge badge-resolved"><span className="badge-dot"></span> Resolved</span>;
      case 'Rejected':
        return <span className="badge badge-rejected"><span className="badge-dot"></span> Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <DashboardLayout
      title={`Hello, ${user?.name ? user.name.split(' ')[0] : 'Student'} 👋`}
      subtitle={`Enrolled Student ID: ${user?.studentId || 'N/A'} • Campus Support Portal`}
    >
      {/* Top Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-pop)',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              fontSize: '0.775rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={14} />
            <span>CAMPUS MAINTENANCE ASSISTANT</span>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Notice an issue on campus facilities?
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '0.95rem', maxWidth: '580px', lineHeight: 1.6 }}>
            Report faulty lighting, damaged laboratory equipment, sanitation, or Wi-Fi connectivity.
            University technicians are dispatched and track every resolution.
          </p>
        </div>
        <Link
          to="/student/submit"
          className="btn btn-lg"
          style={{
            backgroundColor: '#ffffff',
            color: '#064e3b',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <FilePlus2 size={20} color="#059669" />
          <span>Submit New Complaint</span>
        </Link>
      </div>

      {/* Figma Sales KPI Style Metrics Grid */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Complaints</span>
            <div className="metric-icon-box metric-dark">
              <FileText size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.total}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>All Logged</span>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Pending Review</span>
            <div className="metric-icon-box metric-amber">
              <Clock size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.pending}</span>
            <span className="badge badge-pending">Queue</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">In Progress</span>
            <div className="metric-icon-box metric-purple">
              <Hourglass size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.inProgress}</span>
            <span className="badge badge-in-progress">Active</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Resolved</span>
            <div className="metric-icon-box metric-emerald">
              <CheckCircle size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.resolved}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>Completed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="table-container">
        <div className="table-header-strip">
          <div>
            <h3 className="table-title">Recent Submissions</h3>
            <p className="table-subtitle">Your latest logged maintenance and facility requests</p>
          </div>
          <Link to="/student/complaints" className="btn btn-outline btn-sm">
            <span>View All ({stats.total})</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 1.25rem' }}></div>
            <p>Loading records from MongoDB Atlas...</p>
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-box">
              <FilePlus2 size={34} />
            </div>
            <h4 className="empty-title">No complaints submitted yet</h4>
            <p className="empty-subtitle">
              You haven't submitted any complaints yet. When you notice a facility issue, click below.
            </p>
            <Link to="/student/submit" className="btn btn-primary btn-sm">
              <FilePlus2 size={16} />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="table-title">{item.title}</div>
                      <div className="table-subtitle" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Tag size={14} color="#64748b" />
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <MapPin size={14} color="#64748b" />
                        {item.location}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedComplaint(item)}
                        className="btn btn-outline btn-sm"
                        title="View Full Details"
                      >
                        <Eye size={15} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Complaint Inspection</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedComplaint(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.35rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedComplaint.title}</h4>
                {getStatusBadge(selectedComplaint.status)}
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{selectedComplaint.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location / Building</span>
                  <span className="detail-value">{selectedComplaint.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Submitted On</span>
                  <span className="detail-value">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">
                    {new Date(selectedComplaint.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '0.65rem' }}>
                <span className="detail-label">Problem Description</span>
                <div className="detail-desc-box">{selectedComplaint.description}</div>
              </div>

              {selectedComplaint.image && (
                <div className="detail-image-box">
                  <span className="detail-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                    Attached Photo Evidence
                  </span>
                  <img
                    src={`http://localhost:5000${selectedComplaint.image}`}
                    alt="Complaint photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {selectedComplaint.adminResponse ? (
                <div className="admin-response-box">
                  <div className="admin-response-title">
                    <MessageSquare size={16} />
                    <span>Official University Administrator Response</span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: '#047857', lineHeight: 1.6 }}>
                    {selectedComplaint.adminResponse}
                  </p>
                </div>
              ) : (
                <div className="alert alert-info" style={{ marginTop: '1.15rem', marginBottom: 0 }}>
                  <AlertCircle size={16} />
                  <span>The administration has not attached written remarks yet. Check back soon!</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedComplaint(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
