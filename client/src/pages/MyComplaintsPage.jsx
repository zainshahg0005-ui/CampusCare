import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FilePlus2,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import ComplaintDrawer from '../components/ComplaintDrawer';
import SkeletonTable from '../components/SkeletonTable';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';
import { CATEGORY_FILTER_OPTIONS as categories } from '../constants/categories';

const statusTabs = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const MyComplaintsPage = () => {
  useDocumentTitle('My Grievances');
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';
  const initialPriority = searchParams.get('priority') || 'All';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedPriority, setSelectedPriority] = useState(initialPriority);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

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

  const filteredComplaints = complaints.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout
      title="My Grievances & Service Logs"
      subtitle="Track real-time progress and official technician notes"
    >
      {/* Top Filter and Action Bar */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        {/* Status Pill Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {statusTabs.map((tab) => {
            const count = tab === 'All' ? complaints.length : complaints.filter((c) => c.status === tab).length;
            const isSelected = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: 999,
                  border: isSelected ? '1px solid #09090b' : '1px solid #e4e4e7',
                  background: isSelected ? '#09090b' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#52525b',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: isSelected ? '#27272a' : '#f4f4f5',
                    color: isSelected ? '#ffffff' : '#71717a',
                    padding: '0.1rem 0.4rem',
                    borderRadius: 999,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="filters-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-box" style={{ flex: 1, minWidth: 260 }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Filter by keyword, location, or issue..."
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
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            <button
              onClick={fetchComplaints}
              className="btn btn-outline"
              title="Refresh logs"
              style={{ padding: '0.55rem' }}
            >
              <RefreshCw size={16} />
            </button>

            <Link to="/student/submit" className="btn btn-primary">
              <FilePlus2 size={16} />
              <span>New Grievance</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="dashboard-card">
        {loading ? (
          <SkeletonTable rows={5} cols={7} />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title={complaints.length === 0 ? 'No complaints lodged yet' : 'No complaints match the filter'}
            description={
              complaints.length === 0
                ? 'Report facility issues with electricity, Wi-Fi, washrooms, or classrooms to have them resolved.'
                : 'Try adjusting your search terms, status, or facility category.'
            }
            actionLabel={complaints.length === 0 ? 'Submit First Grievance' : 'Reset Filters'}
            actionIcon={complaints.length === 0 ? FilePlus2 : RefreshCw}
            onAction={() => {
              if (complaints.length === 0) {
                window.location.href = '/student/submit';
              } else {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSelectedPriority('All');
              }
            }}
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Title & Description</th>
                  <th className="col-hide-mobile">Category</th>
                  <th className="col-hide-mobile">Location</th>
                  <th className="col-hide-mobile">Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
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
                    <td style={{ maxWidth: 300 }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{c.title}</div>
                      <div
                        style={{
                          fontSize: '0.775rem',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.description}
                      </div>
                    </td>
                    <td className="col-hide-mobile">
                      <span style={{ fontSize: '0.8rem', fontWeight: 550, color: '#374151' }}>
                        {c.category}
                      </span>
                    </td>
                    <td className="col-hide-mobile">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#4b5563' }}>
                        <MapPin size={13} color="#059669" />
                        <span>{c.location}</span>
                      </div>
                    </td>
                    <td className="col-hide-mobile">
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
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

export default MyComplaintsPage;
