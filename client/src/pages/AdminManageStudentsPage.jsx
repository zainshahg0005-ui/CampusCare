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
            <p className="table-subtitle">Showing {students.length} student records from MongoDB Atlas</p>
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
                  <th>Email Address</th>
                  <th>Registered Date</th>
                  <th>Total Complaints</th>
                  <th>Status Breakdown</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                        <div className="table-title">{student.name}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#09090b', fontFamily: 'monospace' }}>
                        <CreditCard size={15} color="#71717a" />
                        {student.studentId}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b' }}>
                        <Mail size={15} />
                        {student.email}
                      </span>
                    </td>
                    <td>
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
                    <td>
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
                        onClick={() => setSelectedStudent({ ...student, avatar: studentAvatars[idx % studentAvatars.length] })}
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
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Student Profile Dossier</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img
                  src={selectedStudent.avatar || studentAvatars[0]}
                  alt="Student Profile"
                  style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedStudent.name}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Student Identification: <strong style={{ color: '#1e3a8a' }}>{selectedStudent.studentId}</strong>
                  </p>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{selectedStudent.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Enrolled Since</span>
                  <span className="detail-value">
                    {new Date(selectedStudent.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Grievances Lodged</span>
                  <span className="detail-value">{selectedStudent.complaintCount}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pending Tickets</span>
                  <span className="detail-value">{selectedStudent.pendingCount}</span>
                </div>
              </div>

              <div className="card" style={{ backgroundColor: '#f8fafc', marginTop: '1rem', padding: '1.25rem' }}>
                <h5 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', color: '#0f172a', fontWeight: 700 }}>
                  Account Status & Standing
                </h5>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  Active campus user registered via the CampusCare portal. All grievances lodged by this
                  student are securely stored and verified in your MongoDB Atlas cloud database.
                </p>
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
