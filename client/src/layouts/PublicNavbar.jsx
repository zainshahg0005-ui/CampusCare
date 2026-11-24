import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-box">
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <span className="brand-text">
            Campus<span className="brand-accent">Care</span>
          </span>
        </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Student Portal</Link>
            <Link to="/admin/login" className="nav-link">Admin Access</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="user-nav-group">
                <button onClick={handleDashboardRedirect} className="btn btn-primary btn-sm">
                  Dashboard ({user?.name.split(' ')[0]})
                </button>
                <button onClick={logout} className="btn btn-outline btn-sm" title="Log Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Student Sign In
                </Link>
                <Link to="/admin/login" className="btn btn-ghost btn-sm" style={{ border: '1px solid #e4e4e7' }}>
                  Admin
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
            <span>Home</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Overview</span>
          </Link>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
            <span>How It Works</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>3 Steps</span>
          </a>
          <a href="/#facilities" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
            <span>Campus Facilities</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Coverage</span>
          </a>
          <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
            <span>Terms & Conditions</span>
            <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Rules</span>
          </Link>
          <hr className="divider" />
          {isAuthenticated ? (
            <div className="mobile-auth-stack">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
                className="btn btn-primary full-width"
              >
                Go to Dashboard ({user?.name?.split(' ')[0] || 'User'})
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="btn btn-outline full-width"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="mobile-auth-stack">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline full-width"
              >
                Student Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary full-width"
              >
                Register Student Account
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-ghost full-width"
                style={{ border: '1px solid #e4e4e7', fontSize: '0.85rem' }}
              >
                Admin Terminal Access
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
