import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
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
  Shield,
  GraduationCap,
  UserCheck,
  MessageSquare,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CommandPalette from '../components/CommandPalette';
import NotificationPopover from '../components/NotificationPopover';
import SupportChatWidget from '../components/SupportChatWidget';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, logout, isAdmin, isStudent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-close mobile sidebar and popovers on route transition
  useEffect(() => {
    setSidebarOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentNavItems = [
    { label: 'Campus Home', path: '/', icon: Home },
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Submit Complaint', path: '/student/submit', icon: FilePlus2 },
    { label: 'My Complaints', path: '/student/complaints', icon: FolderOpen },
    { label: 'My Profile', path: '/student/profile', icon: UserCheck },
  ];

  const adminNavItems = [
    { label: 'Campus Home', path: '/', icon: Home },
    { label: 'Executive Cockpit', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Complaints', path: '/admin/complaints', icon: FolderOpen },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
    { label: 'Live Support Desk', path: '/admin/support', icon: MessageSquare },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const getInitials = (name) => {
    if (!name) return 'CC';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Figma Sales Dashboard Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="brand-logo" title="Back to CampusCare Home" style={{ textDecoration: 'none' }}>
            <div className="brand-icon-box">
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <span className="brand-text">
              Campus<span className="brand-accent">Care</span>
            </span>
          </Link>
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
          <div
            className="user-profile-card"
            style={{ cursor: isStudent ? 'pointer' : 'default' }}
            onClick={() => {
              if (isStudent) {
                navigate('/student/profile');
                setSidebarOpen(false);
              }
            }}
            title={isStudent ? 'View and edit your student profile' : ''}
          >
            <div
              className="user-avatar-badge"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#09090b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
                flexShrink: 0,
                border: '1px solid #27272a',
                overflow: 'hidden',
              }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'Profile'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </div>
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

          <div className="topbar-right" style={{ position: 'relative' }}>
            {/* Quick Link to Campus Public Home Page */}
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                padding: '0.45rem 0.85rem',
                borderRadius: 10,
                color: '#09090b',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              className="topbar-home-link"
              title="Return to CampusCare Public Home Page"
            >
              <Home size={15} color="#09090b" />
              <span>Campus Home</span>
            </Link>

            {/* Quick Command Palette Button */}
            <button
              onClick={() => setCmdOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                padding: '0.45rem 0.85rem',
                borderRadius: 10,
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '0.8rem',
                transition: 'all 0.15s ease',
              }}
              className="topbar-cmd-trigger"
              title="Search tickets or jump to pages (Ctrl+K)"
            >
              <Search size={15} color="#71717a" />
              <span>Search or command...</span>
              <kbd style={{ marginLeft: 6 }}>Ctrl K</kbd>
            </button>

            {/* Notification Bell */}
            <button
              className="topbar-icon-btn"
              title="Notifications"
              onClick={() => setNotifOpen((prev) => !prev)}
            >
              <Bell size={18} />
              <span className="notification-badge-dot" />
            </button>

            {/* Notification Dropdown */}
            <NotificationPopover isOpen={notifOpen} onClose={() => setNotifOpen(false)} />

            {/* User Chip */}
            <div
              className="user-chip"
              style={{ cursor: isStudent ? 'pointer' : 'default' }}
              onClick={() => {
                if (isStudent) navigate('/student/profile');
              }}
              title={isStudent ? 'Go to My Profile' : ''}
            >
              <div
                className="user-chip-avatar-badge"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#09090b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.775rem',
                  letterSpacing: '0.5px',
                  flexShrink: 0,
                  border: '1px solid #27272a',
                  overflow: 'hidden',
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="user-chip-text">
                <span className="chip-name">{user?.name}</span>
                <span className="chip-role">{isAdmin ? 'Admin' : user?.studentId || 'Student'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Command Palette */}
        <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

        {/* Page Content */}
        <main className="dashboard-content">{children}</main>
      </div>

      {/* Floating Help & Support Widget available for registered users */}
      <SupportChatWidget />
    </div>
  );
};

export default DashboardLayout;
