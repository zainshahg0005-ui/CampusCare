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

            {/* Quick Ticket Lookup */}
            <form onSubmit={handleTicketLookup} style={{ marginBottom: '1.75rem', maxWidth: 440 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #d4d4d8',
                  borderRadius: 10,
                  padding: '0.25rem 0.35rem 0.25rem 0.75rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Search size={16} color="#71717a" />
                <input
                  type="text"
                  placeholder="Enter Ticket ID (e.g. CC-104)..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '0.5rem 0.65rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 6 }}
                >
                  Track
                </button>
              </div>

              {searchFeedback && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    background: '#f4f4f5',
                    border: '1px solid #e4e4e7',
                    borderRadius: 8,
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.8rem',
                    color: '#18181b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>#{searchFeedback.ticketId}</strong>: {searchFeedback.status} — {searchFeedback.note}
                  </div>
                  <Link to="/login" style={{ fontWeight: 600, color: '#09090b', textDecoration: 'underline' }}>
                    View details →
                  </Link>
                </div>
              )}
            </form>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Lodge a Complaint</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <span>Portal Sign In</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Hero Visual with Skeleton Loader & Lazy Loading */}
          <div className="hero-visual-wrapper">
            <ImageWithSkeleton
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80&fm=webp"
              alt="University Campus Architecture"
              className="hero-main-photo"
              containerStyle={{ borderRadius: 16, height: 380 }}
            />
            <div className="hero-floating-glass-card">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: '#f4f4f5',
                  color: '#18181b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#09090b' }}>
                  Audited Resolutions
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                  Average turnaround under 3.2 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Lifecycle (Clean, Simple, Direct) */}
      <section style={{ padding: '4rem 0', background: '#ffffff', borderTop: '1px solid #e4e4e7', borderBottom: '1px solid #e4e4e7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.85rem', color: '#09090b', marginBottom: '0.5rem' }}>
              How CampusCare Works
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.925rem' }}>
              A transparent, 3-step lifecycle connecting students directly with facility engineers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                01 / Report
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#09090b', marginBottom: '0.5rem' }}>
                File in 60 Seconds
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#52525b', lineHeight: 1.6 }}>
                Select category, enter room or block location, and attach photo evidence directly from your device.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                02 / Dispatch
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#09090b', marginBottom: '0.5rem' }}>
                Automated Triage & SLA
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#52525b', lineHeight: 1.6 }}>
                Tickets are routed to specific maintenance teams with defined turnaround guarantees based on urgency.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#71717a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                03 / Resolve
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#09090b', marginBottom: '0.5rem' }}>
                Verified Closure
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#52525b', lineHeight: 1.6 }}>
                Technician logs official repair notes, and the ticket is closed with full audit history accessible to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Covered Grid */}
      <section style={{ padding: '4.5rem 0', background: '#fafafa' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', color: '#09090b', marginBottom: '0.5rem' }}>
              Campus Facilities Covered
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.925rem' }}>
              Comprehensive maintenance coverage across academic and residential infrastructure.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
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
                <div key={idx} className="card" style={{ padding: '1.35rem' }}>
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
                      marginBottom: '0.85rem',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '0.975rem', color: '#09090b', marginBottom: '0.35rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.825rem', color: '#71717a', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Team Credits Section */}
      <section style={{ padding: '4.5rem 0 5rem', background: '#ffffff', borderTop: '1px solid #e4e4e7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 2.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                background: '#f4f4f5',
                border: '1px solid #e4e4e7',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#52525b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '1rem',
              }}
            >
              <span>Project Team</span>
            </div>
            <h2 style={{ fontSize: '1.85rem', color: '#09090b', marginBottom: '0.5rem', fontWeight: 700 }}>
              Developed By
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.925rem' }}>
              Engineered by the CampusCare development team with modern MERN architecture, secure authentication, and real-time maintenance telemetry.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
              maxWidth: 960,
              margin: '0 auto',
            }}
          >
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
