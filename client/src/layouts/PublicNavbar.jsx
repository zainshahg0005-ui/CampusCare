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
          <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Features</a>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="mobile-link">How It Works</a>
          <a href="/#stats" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Statistics</a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Contact</a>
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
                Go to Dashboard
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
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary full-width"
              >
                Get Started (Register)
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
