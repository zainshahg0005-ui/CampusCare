import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Mail,
  CreditCard,
  Calendar,
  Eye,
  X,
  RefreshCw,
  Phone,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import SkeletonTable from '../components/SkeletonTable';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../hooks/useDocumentTitle';
import api from '../services/api';

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const AdminManageStudentsPage = () => {
  useDocumentTitle('Student Directory');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/admin/students', { params });
      if (res.data?.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <DashboardLayout
      title="Student Directory 👥"
      subtitle="Complete student registry and grievance resolution activity records"
    >
      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} className="filters-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by student name, student ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              fetchStudents();
            }}
            className="btn btn-outline"
            title="Reset Search"
          >
            <RefreshCw size={16} />
          </button>
        </form>
      </div>

      {/* Students Directory */}
      <div className="table-container">
        <div className="table-header-strip">
          <div>
            <h3 className="table-title">Enrolled Students</h3>
            <p className="table-subtitle">Showing {students.length} verified enrolled students from MongoDB Atlas</p>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={7} />
        ) : students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description={
              search.trim()
                ? 'No registered student matched your search query.'
                : 'No students have registered yet. New signups will appear here.'
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th className="col-hide-mobile">Email Address</th>
                  <th className="col-hide-mobile">Registered Date</th>
                  <th>Total Complaints</th>
                  <th className="col-hide-mobile">Status Breakdown</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid #27272a',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: '#09090b',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px',
                              flexShrink: 0,
                              border: '1px solid #27272a',
                            }}
                          >
                            {getInitials(student.name)}
                          </div>
                        )}
                        <div className="table-title">{student.name}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#09090b', fontFamily: 'monospace' }}>
                        <CreditCard size={15} color="#71717a" />
                        {student.studentId}
                      </span>
                    </td>
                    <td className="col-hide-mobile">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
                        <Mail size={15} />
                        {student.email}
                      </span>
                    </td>
                    <td className="col-hide-mobile">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <Calendar size={14} />
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                        {student.complaintCount}
                      </span>
                    </td>
                    <td className="col-hide-mobile">
                      <div style={{ display: 'flex', gap: '0.45rem' }}>
                        <span className="badge badge-pending" style={{ padding: '0.2rem 0.55rem' }}>
                          {student.pendingCount} Pending
                        </span>
                        <span className="badge badge-resolved" style={{ padding: '0.2rem 0.55rem' }}>
                          {student.resolvedCount} Resolved
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="btn btn-outline btn-sm"
                        title="View Full Profile"
                      >
                        <Eye size={14} />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h3 className="modal-title">Student Profile</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #e4e4e7' }}>
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #09090b',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: '#09090b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      letterSpacing: '1px',
                      flexShrink: 0,
                      border: '3px solid #18181b',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    }}
                  >
                    {getInitials(selectedStudent.name)}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#09090b' }}>
                    {selectedStudent.name}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: '#71717a' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#09090b', fontFamily: 'monospace' }}>
                      <CreditCard size={14} color="#71717a" />
                      ID: {selectedStudent.studentId}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building2 size={14} color="#71717a" />
                      {selectedStudent.department || 'Department Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} /> Email Address
                  </span>
                  <span className="detail-value" style={{ wordBreak: 'break-all' }}>{selectedStudent.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} /> Contact / WhatsApp
                  </span>
                  <span className="detail-value">{selectedStudent.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={13} /> Department
                  </span>
                  <span className="detail-value">{selectedStudent.department || 'General Enrollment'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} /> Enrolled Date
                  </span>
                  <span className="detail-value">
                    {new Date(selectedStudent.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {selectedStudent.bio && (
                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: '#f4f4f5', borderRadius: '8px', border: '1px solid #e4e4e7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717a', marginBottom: '0.35rem', letterSpacing: '0.5px' }}>
                    <FileText size={13} /> Student Bio / Campus Residence
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#27272a', lineHeight: 1.5 }}>
                    {selectedStudent.bio}
                  </p>
                </div>
              )}

              {/* Grievance Statistics */}
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#fafafa', borderRadius: '10px', border: '1px solid #e4e4e7' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#71717a', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                  Grievance Resolution Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
                  <div style={{ padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e7' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#09090b' }}>{selectedStudent.complaintCount}</div>
                    <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600 }}>Total Complaints</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #fef08a' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <Clock size={16} />
                      {selectedStudent.pendingCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#854d0e', fontWeight: 600 }}>Pending</div>
                  </div>
                  <div style={{ padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={16} />
                      {selectedStudent.resolvedCount}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Resolved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedStudent(null)}
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

export default AdminManageStudentsPage;
