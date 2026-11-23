import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  X,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/my');
      if (res.data?.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
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

  // Filter complaints based on search query, category, and status
  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout
      title="My Complaints"
      subtitle="View all reports and track maintenance resolutions"
    >
      {/* Top Filter and Action Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="filters-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by title, location, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="All">All Categories</option>
              <option value="Classroom">Classroom</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Internet/Wi-Fi">Internet/Wi-Fi</option>
              <option value="Washroom">Washroom</option>
              <option value="Electricity">Electricity</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Other">Other</option>
            </select>

            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ width: 'auto', minWidth: '140px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={fetchComplaints}
              className="btn btn-outline"
              title="Refresh list"
            >
              <RefreshCw size={16} />
            </button>

            <Link to="/student/submit" className="btn btn-primary">
              <FilePlus2 size={16} />
              <span>New Ticket</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container">
        {loading ? (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading your complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-box">
              <Filter size={32} />
            </div>
            <h4 className="empty-title">No matching complaints found</h4>
            <p className="empty-subtitle">
              {complaints.length === 0
                ? "You haven't logged any complaints yet. Use the New Ticket button above to report an issue."
                : 'Try adjusting your search keywords or filter criteria.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Title & Summary</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="table-title">{item.title}</div>
                      <div className="table-subtitle" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                        title="View details and admin remarks"
                      >
                        <Eye size={15} />
                        <span>View Details</span>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedComplaint.title}</h4>
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
                  <span className="detail-label">Lodged Date</span>
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

              <div style={{ marginBottom: '1rem' }}>
                <span className="detail-label">Full Problem Description</span>
                <div className="detail-desc-box">{selectedComplaint.description}</div>
              </div>

              {selectedComplaint.image && (
                <div className="detail-image-box">
                  <span className="detail-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                    Uploaded Photo Evidence
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
                  <p style={{ fontSize: '0.925rem', color: '#14532d' }}>
                    {selectedComplaint.adminResponse}
                  </p>
                </div>
              ) : (
                <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <AlertCircle size={16} />
                  <span>The administration team is currently reviewing your ticket.</span>
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

export default MyComplaintsPage;
