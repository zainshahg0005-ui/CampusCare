import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Tag,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const categories = [
  'All',
  'Classroom',
  'Laboratory',
  'Internet/Wi-Fi',
  'Washroom',
  'Electricity',
  'Water Supply',
  'Other',
];

const statuses = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const studentAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
];

const AdminManageComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [viewComplaint, setViewComplaint] = useState(null);
  const [editComplaint, setEditComplaint] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    adminResponse: '',
  });
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/complaints', { params });
      if (res.data?.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Failed to retrieve complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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

  const openEditModal = (complaint) => {
    setEditComplaint(complaint);
    setFormData({
      status: complaint.status,
      adminResponse: complaint.adminResponse || '',
    });
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!editComplaint) return;

    try {
      setUpdating(true);
      const res = await api.put(`/admin/complaints/${editComplaint._id}/status`, {
        status: formData.status,
        adminResponse: formData.adminResponse,
      });

      if (res.data?.success) {
        setNotification({
          type: 'success',
          text: `Ticket #${editComplaint._id.slice(-6)} successfully updated to "${formData.status}".`,
        });
        setEditComplaint(null);
        fetchComplaints();
        setTimeout(() => setNotification({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update complaint status',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout
      title="Manage Grievance Tickets 🗂️"
      subtitle="Complete maintenance dispatch and real-time status publication"
    >
      {notification.text && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} className="filters-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by student name, ID, title, or building..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto', minWidth: '140px' }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary">
              Filter
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
                fetchComplaints();
              }}
              className="btn btn-outline"
              title="Reset Filters"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="table-container">
        <div className="table-header-strip">
          <div>
            <h3 className="table-title">All Campus Grievances</h3>
            <p className="table-subtitle">Showing {complaints.length} filtered ticket records</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Fetching records from MongoDB Atlas...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-box">
              <FolderOpen size={32} />
            </div>
            <h4 className="empty-title">No matching complaints</h4>
            <p className="empty-subtitle">Try adjusting your category, status, or search keywords.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Lodged Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((item, idx) => (
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
                          <div className="table-subtitle">
                            ID: {item.studentId?.studentId || 'N/A'} • {item.studentId?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-title">{item.title}</div>
                      <div className="table-subtitle" style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <Tag size={14} color="#64748b" />
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                        <MapPin size={14} color="#64748b" />
                        {item.location}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setViewComplaint(item)}
                          className="btn btn-outline btn-sm"
                          title="View Full Inspection"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-primary btn-sm"
                          title="Change Status & Add Remarks"
                        >
                          <Edit size={14} />
                          <span>Status</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {viewComplaint && (
        <div className="modal-backdrop" onClick={() => setViewComplaint(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Grievance Investigation Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setViewComplaint(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{viewComplaint.title}</h4>
                {getStatusBadge(viewComplaint.status)}
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Student Name</span>
                  <span className="detail-value">{viewComplaint.studentId?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student ID</span>
                  <span className="detail-value">{viewComplaint.studentId?.studentId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student Email</span>
                  <span className="detail-value">{viewComplaint.studentId?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location / Room</span>
                  <span className="detail-value">{viewComplaint.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{viewComplaint.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created At</span>
                  <span className="detail-value">{new Date(viewComplaint.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span className="detail-label">Student's Description</span>
                <div className="detail-desc-box">{viewComplaint.description}</div>
              </div>

              {viewComplaint.image && (
                <div className="detail-image-box">
                  <span className="detail-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Attached Photo Evidence
                  </span>
                  <img
                    src={`http://localhost:5000${viewComplaint.image}`}
                    alt="Complaint photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {viewComplaint.adminResponse ? (
                <div className="admin-response-box">
                  <div className="admin-response-title">
                    <MessageSquare size={16} />
                    <span>Current Admin Response</span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: '#047857' }}>
                    {viewComplaint.adminResponse}
                  </p>
                </div>
              ) : (
                <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <AlertCircle size={16} />
                  <span>No administrative response has been logged yet for this ticket.</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setViewComplaint(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const toEdit = viewComplaint;
                  setViewComplaint(null);
                  openEditModal(toEdit);
                }}
              >
                <Edit size={16} />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status & Remarks Modal */}
      {editComplaint && (
        <div className="modal-backdrop" onClick={() => setEditComplaint(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Ticket Status</h3>
              <button
                className="modal-close-btn"
                onClick={() => setEditComplaint(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {editComplaint.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Student: {editComplaint.studentId?.name} ({editComplaint.studentId?.studentId})
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-status">
                    Complaint Status <span className="required">*</span>
                  </label>
                  <select
                    id="edit-status"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="edit-response">
                    Official Admin Response / Action Taken
                  </label>
                  <textarea
                    id="edit-response"
                    className="form-textarea"
                    placeholder="Enter notes on work performed, technicians assigned, or explanation of rejection..."
                    value={formData.adminResponse}
                    onChange={(e) => setFormData({ ...formData, adminResponse: e.target.value })}
                    rows={4}
                  />
                  <span className="form-hint">
                    This message is immediately updated in MongoDB Atlas and displayed on the student's dashboard.
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditComplaint(null)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save & Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminManageComplaintsPage;
