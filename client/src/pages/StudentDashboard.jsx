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
import SkeletonTable from '../components/SkeletonTable';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
  useDocumentTitle('Student Workspace');
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
        className="card student-banner-card"
        style={{
          background: '#09090b',
          border: '1px solid #27272a',
          color: '#ffffff',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          padding: 'clamp(1.1rem, 4vw, 1.75rem) clamp(1rem, 5vw, 2rem)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              background: '#27272a',
              borderRadius: '9999px',
              fontSize: '0.725rem',
              fontWeight: 600,
              color: '#d4d4d8',
              marginBottom: '0.65rem',
            }}
          >
            <Sparkles size={12} />
            <span>CAMPUS SUPPORT PORTAL</span>
          </div>
          <h2 style={{ color: '#ffffff', fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Notice an issue on campus facilities?
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.875rem', maxWidth: '520px', lineHeight: 1.5, margin: 0 }}>
            Report faulty lighting, damaged lab equipment, sanitation, or Wi-Fi connectivity.
            University technicians are dispatched and track every resolution.
          </p>
        </div>
        <Link
          to="/student/submit"
          className="btn btn-outline btn-lg"
          style={{
            backgroundColor: '#ffffff',
            color: '#09090b',
            border: 'none',
            fontWeight: 700,
          }}
        >
          <FilePlus2 size={18} color="#09090b" />
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
          <SkeletonTable rows={4} cols={6} />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title={recentComplaints.length === 0 ? 'No complaints filed yet' : 'No matching grievances found'}
            description={
              recentComplaints.length === 0
                ? 'Report an issue with hostel Wi-Fi, lab equipment, or classroom facilities to notify technicians.'
                : 'Try adjusting your search keywords.'
            }
            actionLabel={recentComplaints.length === 0 ? 'Submit First Complaint' : 'Clear Search'}
            actionIcon={recentComplaints.length === 0 ? FilePlus2 : Search}
            onAction={() => {
              if (recentComplaints.length === 0) {
                window.location.href = '/student/submit';
              } else {
                setSearchFilter('');
              }
            }}
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Title & Category</th>
                  <th className="col-hide-mobile">Location</th>
                  <th className="col-hide-mobile">Date</th>
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
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: '#09090b', background: '#f4f4f5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e4e4e7' }}>
                        #{c.ticketId || c._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.category}</div>
                    </td>
                    <td className="col-hide-mobile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#4b5563' }}>
                        <MapPin size={13} color="#71717a" />
                        <span>{c.location || 'Campus'}</span>
                      </div>
                    </td>
                    <td className="col-hide-mobile">
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
