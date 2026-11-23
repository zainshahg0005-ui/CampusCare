import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  FilePlus2,
  FolderOpen,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  Shield,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentNavItems = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Submit Complaint', path: '/student/submit', icon: FilePlus2 },
    { label: 'My Complaints', path: '/student/complaints', icon: FolderOpen },
  ];

  const adminNavItems = [
    { label: 'Executive Cockpit', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Complaints', path: '/admin/complaints', icon: FolderOpen },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const userAvatarUrl = isAdmin
    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Figma Sales Dashboard Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon-box" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)' }}>
              <ShieldCheck size={22} color="#ffffff" />
            </div>
            <span className="brand-text">
              Campus<span className="brand-accent">Care</span>
            </span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Portal Identifier Chip */}
        <div className="portal-badge-wrapper">
          <div className={`portal-badge ${isAdmin ? 'admin-badge' : 'student-badge'}`}>
            {isAdmin ? <Shield size={14} /> : <GraduationCap size={14} />}
            <span>{isAdmin ? 'Administration Portal' : 'Student Workspace'}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem 0.25rem' }}>
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} className="sidebar-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Card */}
        <div className="sidebar-footer">
          <div className="user-profile-card">
            <img
              src={userAvatarUrl}
              alt="Avatar"
              className="user-avatar-img"
            />
            <div className="user-info">
              <div className="user-name" title={user?.name}>{user?.name}</div>
              <div className="user-subtext">
                {isAdmin ? 'System Administrator' : user?.studentId || user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline full-width"
            style={{ fontSize: '0.825rem', padding: '0.55rem' }}
            title="Log out of account"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="dashboard-main-wrapper">
        {/* Figma Topbar */}
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button
              className="topbar-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>
            <div className="topbar-title-group">
              <h1 className="page-heading">{title}</h1>
              {subtitle && <p className="page-subheading">{subtitle}</p>}
            </div>
          </div>

          <div className="topbar-right">
            {/* Notification Bell */}
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="notification-badge-dot" />
            </button>

            {/* User Chip */}
            <div className="user-chip">
              <img
                src={userAvatarUrl}
                alt="Profile"
                className="user-chip-avatar"
              />
              <div className="user-chip-text">
                <span className="chip-name">{user?.name}</span>
                <span className="chip-role">{isAdmin ? 'Admin' : user?.studentId || 'Student'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
