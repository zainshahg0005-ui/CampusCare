import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  Hourglass,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Eye,
  Edit,
  Tag,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Sparkles,
  Shield,
  Layers,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
    recentComplaints: [],
    categoryStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    adminResponse: '',
  });
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data?.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
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

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate({
      status: complaint.status,
      adminResponse: complaint.adminResponse || '',
    });
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      setUpdating(true);
      const res = await api.put(`/admin/complaints/${selectedComplaint._id}/status`, {
        status: statusUpdate.status,
        adminResponse: statusUpdate.adminResponse,
      });

      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: `Complaint #${selectedComplaint._id.slice(-6)} updated successfully!`,
        });
        setStatusModalOpen(false);
        fetchDashboardMetrics();
        setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update complaint status',
      });
    } finally {
      setUpdating(false);
    }
  };

  const studentAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <DashboardLayout
      title="Executive Overview 📊"
      subtitle="Real-time campus grievance metrics, resolution velocity, and operations overview"
    >
      {feedback.text && (
        <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 5 Figma Sales KPI Cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Enrolled Students</span>
            <div className="metric-icon-box metric-dark">
              <Users size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{dashboardData.totalStudents}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>+8.4%</span>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Grievances</span>
            <div className="metric-icon-box metric-emerald">
              <FileText size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{dashboardData.totalComplaints}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>Campus total</span>
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
            <span className="metric-value">{dashboardData.pendingComplaints}</span>
            <span className="badge badge-pending">Action Queue</span>
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
            <span className="metric-value">{dashboardData.inProgressComplaints}</span>
            <span className="badge badge-in-progress">Dispatched</span>
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
            <span className="metric-value">{dashboardData.resolvedComplaints}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>Completed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Chart Row (Figma Sales Dashboard Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Weekly Activity Bar Chart Widget */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Weekly Resolution Velocity</h3>
              <p style={{ fontSize: '0.825rem', color: '#6b7280' }}>Daily resolved vs logged tickets over past 7 days</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#059669' }}></span>
                Resolved
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#e5e7eb' }}></span>
                Logged
              </span>
            </div>
          </div>

          {/* Clean Rounded Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', padding: '0 0.5rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
            {[
              { day: 'Mon', resolved: 65, total: 80 },
              { day: 'Tue', resolved: 85, total: 100 },
              { day: 'Wed', resolved: 90, total: 95 },
              { day: 'Thu', resolved: 70, total: 85 },
              { day: 'Fri', resolved: 95, total: 110 },
              { day: 'Sat', resolved: 40, total: 45 },
              { day: 'Sun', resolved: 25, total: 30 },
            ].map((col) => (
              <div key={col.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '130px' }}>
                  <div
                    style={{
                      width: '16px',
                      height: `${col.resolved}%`,
                      background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease',
                    }}
                    title={`${col.day} Resolved: ${col.resolved}%`}
                  />
                  <div
                    style={{
                      width: '16px',
                      height: `${col.total}%`,
                      background: '#e5e7eb',
                      borderRadius: '4px 4px 0 0',
                    }}
                    title={`${col.day} Total: ${col.total}%`}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280' }}>{col.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#6b7280' }}>Average Resolution SLA</span>
            <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUp size={14} /> 94.6% Within 24 Hours
            </strong>
          </div>
        </div>

        {/* Resolution Efficiency Gauge & Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Resolution Efficiency</h3>
              <p style={{ fontSize: '0.825rem', color: '#6b7280' }}>Status distribution ratio</p>
            </div>
            <PieChart size={20} color="#059669" />
          </div>

          {/* Circular Donut Gauge Representation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="140" height="140" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="88, 100"
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', display: 'block', lineHeight: 1 }}>
                  88%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600 }}>Resolved</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#065f46', fontWeight: 600 }}>
                <span className="badge-dot" style={{ backgroundColor: '#10b981' }}></span>
                Resolved ({dashboardData.resolvedComplaints})
              </span>
              <span style={{ fontWeight: 700 }}>
                {dashboardData.totalComplaints > 0
                  ? Math.round((dashboardData.resolvedComplaints / dashboardData.totalComplaints) * 100)
                  : 0}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6b21a8', fontWeight: 600 }}>
                <span className="badge-dot" style={{ backgroundColor: '#9333ea' }}></span>
                In Progress ({dashboardData.inProgressComplaints})
              </span>
              <span style={{ fontWeight: 700 }}>
                {dashboardData.totalComplaints > 0
                  ? Math.round((dashboardData.inProgressComplaints / dashboardData.totalComplaints) * 100)
                  : 0}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontWeight: 600 }}>
                <span className="badge-dot" style={{ backgroundColor: '#f59e0b' }}></span>
                Pending Review ({dashboardData.pendingComplaints})
              </span>
              <span style={{ fontWeight: 700 }}>
                {dashboardData.totalComplaints > 0
                  ? Math.round((dashboardData.pendingComplaints / dashboardData.totalComplaints) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table with Student Photo Avatars */}
      <div className="table-container">
        <div className="table-header-strip">
          <div>
            <h3 className="table-title">Recent Student Submissions</h3>
            <p className="table-subtitle">Review incoming grievance tickets, assign technicians, and publish status updates</p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button onClick={fetchDashboardMetrics} className="btn btn-outline btn-sm" title="Refresh">
              <RefreshCw size={15} />
            </button>
            <Link to="/admin/complaints" className="btn btn-primary btn-sm">
              <FolderOpen size={15} />
              <span>Manage All</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 1.25rem' }}></div>
            <p>Loading records from MongoDB Atlas...</p>
          </div>
        ) : dashboardData.recentComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-box">
              <CheckCircle size={34} />
            </div>
            <h4 className="empty-title">All clean! No complaints found</h4>
            <p className="empty-subtitle">When students log issues, they will appear right here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentComplaints.map((item, idx) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={studentAvatars[idx % studentAvatars.length]}
                          alt="Student Avatar"
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="table-title">{item.studentId?.name || 'Unknown Student'}</div>
                          <div className="table-subtitle">{item.studentId?.studentId || item.studentId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-title">{item.title}</div>
                      <div className="table-subtitle" style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => openStatusModal(item)}
                        className="btn btn-primary btn-sm"
                        title="Update status & remarks"
                      >
                        <Edit size={14} />
                        <span>Action</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Status & Remarks Modal */}
      {statusModalOpen && selectedComplaint && (
        <div className="modal-backdrop" onClick={() => setStatusModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Take Action on Complaint</h3>
              <button
                className="modal-close-btn"
                onClick={() => setStatusModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus}>
              <div className="modal-body">
                <div style={{ marginBottom: '1.35rem' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    {selectedComplaint.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Submitted by: {selectedComplaint.studentId?.name} ({selectedComplaint.studentId?.studentId})
                  </p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{selectedComplaint.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{selectedComplaint.location}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.35rem' }}>
                  <span className="detail-label">Student's Description</span>
                  <div className="detail-desc-box">{selectedComplaint.description}</div>
                </div>

                {selectedComplaint.image && (
                  <div className="detail-image-box">
                    <span className="detail-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                      Attached Photo Evidence
                    </span>
                    <img
                      src={`http://localhost:5000${selectedComplaint.image}`}
                      alt="Complaint attachment"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Change Status <span className="required">*</span>
                  </label>
                  <select
                    id="status"
                    className="form-select"
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    required
                  >
                    <option value="Pending">Pending (Under Initial Review)</option>
                    <option value="In Progress">In Progress (Maintenance Team Dispatched)</option>
                    <option value="Resolved">Resolved (Work Completed)</option>
                    <option value="Rejected">Rejected (Invalid or Duplicate Request)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="adminResponse">
                    Official Admin Remarks / Solution Details
                  </label>
                  <textarea
                    id="adminResponse"
                    className="form-textarea"
                    placeholder="e.g. Electrician team repaired wiring in Room 301. Fan capacitor replaced."
                    value={statusUpdate.adminResponse}
                    onChange={(e) =>
                      setStatusUpdate({ ...statusUpdate, adminResponse: e.target.value })
                    }
                    rows={4}
                  />
                  <span className="form-hint">
                    This note will be visible to the student on their portal.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStatusModalOpen(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Update Status & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
