import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  ArrowUp,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import ComplaintDrawer from '../components/ComplaintDrawer';
import SkeletonTable from '../components/SkeletonTable';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';

const AdminDashboard = () => {
  useDocumentTitle('Executive Cockpit');
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchDashboardMetrics = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  const handleOpenDrawer = (complaint) => {
    setSelectedComplaint(complaint);
    setDrawerOpen(true);
  };

  const handleComplaintUpdated = (updated) => {
    fetchDashboardMetrics();
    setSelectedComplaint(updated);
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

  // Resolution velocity calculation
  const resolvedRate = dashboardData.totalComplaints > 0
    ? Math.round((dashboardData.resolvedComplaints / dashboardData.totalComplaints) * 100)
    : 100;

  return (
    <DashboardLayout
      title="Executive Cockpit"
      subtitle="Real-time campus maintenance telemetry, resolution velocity & SLA audits"
    >
      {/* 5 KPI Metric Cards */}
      <div className="admin-metric-grid" style={{ marginBottom: '2rem' }}>
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
              <TrendingUp size={12} />
              <span>Active</span>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Total Grievances</span>
            <div className="metric-icon-box metric-dark">
              <FileText size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{dashboardData.totalComplaints}</span>
            <span className="trend-pill trend-up">
              <ArrowUp size={12} />
              <span>Campus wide</span>
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
            <span className="metric-value">{dashboardData.pendingComplaints}</span>
            <span className="trend-pill" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
              <span>Needs Triage</span>
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
            <span className="metric-value">{dashboardData.inProgressComplaints}</span>
            <span className="trend-pill" style={{ background: '#faf5ff', color: '#6b21a8', borderColor: '#e9d5ff' }}>
              <span>Dispatched</span>
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Resolved Rate</span>
            <div className="metric-icon-box metric-green">
              <CheckCircle size={22} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{resolvedRate}%</span>
            <span className="trend-pill trend-up">
              <CheckCircle size={12} />
              <span>{dashboardData.resolvedComplaints} Closed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Telemetry Grid */}
      <div className="dashboard-grid-2col">
        {/* Weekly Velocity Chart */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#111827', margin: 0 }}>
                Weekly Dispatch & Resolution Velocity
              </h3>
              <p style={{ fontSize: '0.775rem', color: '#6b7280', margin: '2px 0 0' }}>
                Operational capacity over the last 7 calendar days
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#18181b', background: '#f4f4f5', border: '1px solid #e4e4e7', padding: '0.2rem 0.6rem', borderRadius: 6 }}>
              On-Target (Avg 2.8 hrs)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { day: 'Mon', count: 12, height: '65%' },
              { day: 'Tue', count: 18, height: '90%' },
              { day: 'Wed', count: 14, height: '70%' },
              { day: 'Thu', count: 9, height: '45%' },
              { day: 'Fri', count: 16, height: '80%' },
              { day: 'Sat', count: 7, height: '35%' },
              { day: 'Sun', count: 5, height: '25%' },
            ].map((bar) => (
              <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#71717a' }}>{bar.count}</div>
                <div
                  style={{
                    width: '55%',
                    maxWidth: 36,
                    height: bar.height,
                    background: '#09090b',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 500 }}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#09090b', margin: '0 0 1.25rem' }}>
            Volume by Infrastructure
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'Electricity & Power', pct: 38, count: 19, color: '#09090b' },
              { label: 'Network & Wi-Fi', pct: 28, count: 14, color: '#3f3f46' },
              { label: 'Plumbing & Water', pct: 18, count: 9, color: '#71717a' },
              { label: 'Classroom & Labs', pct: 16, count: 8, color: '#a1a1aa' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>{item.label}</span>
                  <span style={{ color: '#6b7280' }}>{item.count} tickets ({item.pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Grievances Feed */}
      <div className="dashboard-card">
        <div className="table-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#111827', margin: 0 }}>
              Live Grievance Dispatch Feed
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '2px 0 0' }}>
              Click any ticket to inspect evidence and update resolution status
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={fetchDashboardMetrics} className="btn btn-outline" style={{ padding: '0.45rem 0.75rem' }} title="Refresh metrics">
              <RefreshCw size={15} />
            </button>
            <Link to="/admin/complaints" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <FolderOpen size={16} />
              <span>Manage All ({dashboardData.totalComplaints})</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={4} cols={7} />
        ) : dashboardData.recentComplaints.length === 0 ? (
          <EmptyState
            title="No complaints logged yet"
            description="The campus facilities system has zero reported active grievances right now."
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Student Info</th>
                  <th>Title & Category</th>
                  <th className="col-hide-mobile">Location</th>
                  <th className="col-hide-mobile">Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentComplaints.map((c) => (
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
                      <div style={{ fontWeight: 600, color: '#111827' }}>
                        {c.student?.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {c.student?.studentId || c.student?.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{c.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.category}</div>
                    </td>
                    <td className="col-hide-mobile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#4b5563' }}>
                        <MapPin size={13} color="#059669" />
                        <span>{c.location}</span>
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
                        <Edit size={14} />
                        <span>Inspect & Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Inspection & Update Drawer */}
      <ComplaintDrawer
        complaint={selectedComplaint}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onComplaintUpdated={handleComplaintUpdated}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
