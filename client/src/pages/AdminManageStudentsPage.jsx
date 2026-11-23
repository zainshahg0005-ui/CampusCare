import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  CreditCard,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

const studentAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
];

const AdminManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
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
  };

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
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Loading student directory...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-box">
              <Users size={32} />
            </div>
            <h4 className="empty-title">No students found</h4>
            <p className="empty-subtitle">
              {search.trim()
                ? 'No registered student matched your search query.'
                : 'No students have registered yet. New signups will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
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
                {students.map((student, idx) => (
                  <tr key={student._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={studentAvatars[idx % studentAvatars.length]}
                          alt={student.name}
                          style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="table-title">{student.name}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#1e3a8a' }}>
                        <CreditCard size={15} color="#64748b" />
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
