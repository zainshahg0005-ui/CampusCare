import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus2,
  Clock,
  CheckCircle,
  Hourglass,
  FileText,
  Eye,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ArrowUp,
  Search,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import ComplaintDrawer from '../components/ComplaintDrawer';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/my');
      if (res.data?.success) {
        setStats(res.data.stats);
        setRecentComplaints(res.data.complaints.slice(0, 8));
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenDrawer = (complaint) => {
    setSelectedComplaint(complaint);
    setDrawerOpen(true);
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

  const filteredComplaints = searchFilter.trim()
    ? recentComplaints.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          c.category?.toLowerCase().includes(searchFilter.toLowerCase()) ||
          c.location?.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : recentComplaints;

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

      {/* KPI Style Metrics Grid */}
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
            <span className="metric-label">Pending Triage</span>
            <div className="metric-icon-box metric-amber">
              <Clock size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.pending}</span>
            <span className="trend-pill" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
              <span>Under Review</span>
            </span>
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
            <span className="trend-pill" style={{ background: '#faf5ff', color: '#6b21a8', borderColor: '#e9d5ff' }}>
              <span>Technician On-site</span>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Resolved</span>
            <div className="metric-icon-box metric-green">
              <CheckCircle size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.resolved}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>Closed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="dashboard-card" style={{ marginTop: '2rem' }}>
        <div className="table-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#111827', margin: 0 }}>
              Recent Complaints
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0' }}>
              Real-time feed of your reported campus grievances
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.35rem 0.65rem' }}>
              <Search size={15} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', marginLeft: 6 }}
              />
            </div>
            <Link to="/student/complaints" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
              <span>View All</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            Loading grievances...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <AlertCircle size={40} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.05rem', color: '#111827', marginBottom: '0.25rem' }}>
              No complaints filed yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
              Have an issue with hostel Wi-Fi, lab equipment, or classroom lighting?
            </p>
            <Link to="/student/submit" className="btn btn-primary">
              <FilePlus2 size={16} />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Title & Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Inspection</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => handleOpenDrawer(c)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: '#064e3b' }}>
                        #{c.ticketId || c._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.category}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#4b5563' }}>
                        <MapPin size={13} color="#059669" />
                        <span>{c.location || 'Campus'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(c);
                        }}
                      >
                        <Eye size={14} />
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

      {/* Slide-over Inspection Drawer */}
      <ComplaintDrawer
        complaint={selectedComplaint}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
