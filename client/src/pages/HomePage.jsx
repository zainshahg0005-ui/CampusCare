import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Search,
  Building,
  Wifi,
  Zap,
  Droplet,
  Activity,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import PublicNavbar from '../layouts/PublicNavbar';
import PublicFooter from '../layouts/PublicFooter';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';
import SupportChatWidget from '../components/SupportChatWidget';

const HomePage = () => {
  useDocumentTitle('Student Grievance & Facility Management');
  const [ticketSearch, setTicketSearch] = useState('');
  const [searchFeedback, setSearchFeedback] = useState(null);

  const handleTicketLookup = (e) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;
    setSearchFeedback({
      ticketId: ticketSearch.trim().toUpperCase(),
      status: 'In Progress',
      note: 'Technician team assigned to inspect facility.',
    });
  };

  return (
    <div className="home-page">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="editorial-hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-pill">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#09090b', display: 'inline-block' }} />
              <span>Campus Facility Management</span>
            </div>

            <h1 className="hero-title">
              Campus issues, resolved with speed & clarity.
            </h1>

            <p className="hero-subtitle">
              Report maintenance faults, track technician dispatch in real-time, and get campus facilities
              fixed fast across residence halls, labs, and classrooms.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Lodge Complaint</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <span>Student Portal</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Quick Ticket Lookup */}
            <form onSubmit={handleTicketLookup} className="hero-ticket-search">
              <div className="ticket-search-bar">
                <Search size={16} color="#71717a" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Track Ticket ID (e.g. CC-104)..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="ticket-search-input"
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 6, flexShrink: 0 }}
                >
                  Track
                </button>
              </div>

              {searchFeedback && (
                <div className="ticket-search-feedback">
                  <div>
                    <strong>#{searchFeedback.ticketId}</strong>: {searchFeedback.status} — {searchFeedback.note}
                  </div>
                  <Link to="/login" style={{ fontWeight: 600, color: '#09090b', textDecoration: 'underline', flexShrink: 0 }}>
                    View details →
                  </Link>
                </div>
              )}
            </form>
          </div>

          {/* Hero Visual with Skeleton Loader & Lazy Loading */}
          <div className="hero-visual-wrapper">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80&fm=webp"
              alt="University Campus Architecture"
              className="hero-main-photo"
              containerClassName="hero-image-container"
            />
            <div className="hero-floating-glass-card">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#f4f4f5',
                  color: '#18181b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.825rem', color: '#09090b' }}>
                  Audited Resolutions
                </strong>
                <span style={{ fontSize: '0.725rem', color: '#71717a' }}>
                  Average turnaround under 3.2 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Lifecycle */}
      <section className="home-lifecycle-section">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">
              How CampusCare Works
            </h2>
            <p className="home-section-subtitle">
              A transparent, 3-step lifecycle connecting students directly with facility engineers.
            </p>
          </div>

          <div className="home-lifecycle-grid">
            <div className="card home-lifecycle-card">
              <div className="home-step-tag">
                01 / Report
              </div>
              <h3 className="home-step-title">
                File in 60 Seconds
              </h3>
              <p className="home-step-desc">
                Select category, enter room or block location, and attach photo evidence directly from your device.
              </p>
            </div>

            <div className="card home-lifecycle-card">
              <div className="home-step-tag">
                02 / Dispatch
              </div>
              <h3 className="home-step-title">
                Automated Triage & SLA
              </h3>
              <p className="home-step-desc">
                Tickets are routed to specific maintenance teams with defined turnaround guarantees based on urgency.
              </p>
            </div>

            <div className="card home-lifecycle-card">
              <div className="home-step-tag">
                03 / Resolve
              </div>
              <h3 className="home-step-title">
                Verified Closure
              </h3>
              <p className="home-step-desc">
                Technician logs official repair notes, and the ticket is closed with full audit history accessible to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Covered Grid */}
      <section className="home-facilities-section">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">
              Campus Facilities Covered
            </h2>
            <p className="home-section-subtitle">
              Comprehensive maintenance coverage across academic and residential infrastructure.
            </p>
          </div>

          <div className="home-facilities-grid">
            {[
              { icon: Wifi, title: 'Network & Wi-Fi', desc: 'Hostels, libraries, auditoriums, and academic quads.' },
              { icon: Zap, title: 'Power & Electrics', desc: 'Lighting, laboratory power, UPS, and circuit breakers.' },
              { icon: Droplet, title: 'Water & Plumbing', desc: 'Water dispensers, washrooms, pumps, and heaters.' },
              { icon: Building, title: 'Residence Hostels', desc: 'Rooms, windows, doors, structural maintenance, and HVAC.' },
              { icon: Activity, title: 'Lecture Theatres', desc: 'Projectors, acoustic panels, desks, and smart podiums.' },
              { icon: ShieldCheck, title: 'Safety & Access', desc: 'Pathway lighting, sirens, gates, and security card readers.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card home-facility-card">
                  <div className="home-facility-icon-box">
                    <Icon size={18} />
                  </div>
                  <h3 className="home-facility-title">{item.title}</h3>
                  <p className="home-facility-desc">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Team Credits Section */}
      <section className="home-team-section">
        <div className="container">
          <div className="home-section-header">
            <div className="home-team-badge">
              <span>Project Team</span>
            </div>
            <h2 className="home-section-title">
              Developed By
            </h2>
            <p className="home-section-subtitle">
              Engineered by the CampusCare development team with modern MERN architecture, secure authentication, and real-time maintenance telemetry.
            </p>
          </div>

          <div className="home-team-grid">
            {[
              { name: 'Zain Shah', rollNo: '2665', initials: 'ZS', role: 'Full Stack & Security' },
              { name: 'M. Salman', rollNo: '2652', initials: 'MS', role: 'Frontend & Architecture' },
              { name: 'M. Furqan', rollNo: '2692', initials: 'MF', role: 'Backend & Database' },
            ].map((member, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  background: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#09090b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    letterSpacing: '1px',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 12px rgba(9, 9, 11, 0.15)',
                  }}
                >
                  {member.initials}
                </div>
                <h3 style={{ fontSize: '1.125rem', color: '#09090b', margin: '0 0 0.35rem', fontWeight: 700 }}>
                  {member.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1rem' }}>
                  {member.role}
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    background: '#f4f4f5',
                    border: '1px solid #e4e4e7',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#18181b',
                    letterSpacing: '0.05em',
                  }}
                >
                  Roll No: {member.rollNo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
      {/* Real-Time Help & Support Floating Action Widget */}
      <SupportChatWidget />
    </div>
  );
};

export default HomePage;
