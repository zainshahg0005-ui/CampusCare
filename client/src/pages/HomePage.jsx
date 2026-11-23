import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Building,
  Wifi,
  Zap,
  Droplet,
  Users,
  ChevronRight,
  Activity,
  Search,
  Check,
  AlertTriangle,
  Flame,
  Layers,
  Shield,
  GraduationCap,
} from 'lucide-react';
import PublicNavbar from '../layouts/PublicNavbar';
import PublicFooter from '../layouts/PublicFooter';

const HomePage = () => {
  const navigate = useNavigate();
  const [ticketSearch, setTicketSearch] = useState('');
  const [searchFeedback, setSearchFeedback] = useState(null);

  // Interactive Live Resolution Playground State
  const scenarios = [
    {
      id: 'wifi',
      title: 'Hostel Block 4: Wi-Fi Signal Loss',
      category: 'Network & IT',
      icon: Wifi,
      location: 'Hostel 4, 3rd Floor Corridor',
      initialSla: '4h SLA Guarantee',
      reportedAt: '10:14 AM Today',
      technician: 'Senior Network Engineer Rajiv S.',
      stages: [
        { label: 'Logged', desc: 'Packet drop reported via student mobile portal', time: '10:14 AM' },
        { label: 'Triaged', desc: 'Automated diagnostic confirms AP-402 failure', time: '10:19 AM' },
        { label: 'Dispatched', desc: 'Technician on-site with replacement PoE switch', time: '10:38 AM' },
        { label: 'Resolved', desc: 'Signal verified at 240 Mbps; ticket closed', time: '11:05 AM' },
      ],
    },
    {
      id: 'power',
      title: 'Engineering Lab 2: 3-Phase Trip',
      category: 'Electrical & Power',
      icon: Zap,
      location: 'Engineering Building, Lab 208',
      initialSla: '2h SLA Guarantee',
      reportedAt: '11:30 AM Today',
      technician: 'Lead Electrician Tariq K.',
      stages: [
        { label: 'Logged', desc: 'Fume hood power loss during metallurgy experiment', time: '11:30 AM' },
        { label: 'Triaged', desc: 'Safety isolation protocol initiated by faculty admin', time: '11:32 AM' },
        { label: 'Dispatched', desc: 'High-voltage team inspecting distribution board B', time: '11:45 AM' },
        { label: 'Resolved', desc: 'Breaker replaced and load-tested; power restored', time: '12:15 PM' },
      ],
    },
    {
      id: 'water',
      title: 'Science Quad: Water Pressure Drop',
      category: 'Plumbing & Water',
      icon: Droplet,
      location: 'Science Complex, Ground Hydration Point',
      initialSla: '3h SLA Guarantee',
      reportedAt: '01:05 PM Today',
      technician: 'Campus Maintenance Team 3',
      stages: [
        { label: 'Logged', desc: 'Low pressure and leak detected at filter valve', time: '01:05 PM' },
        { label: 'Triaged', desc: 'Secondary reservoir pump activated automatically', time: '01:12 PM' },
        { label: 'Dispatched', desc: 'Plumber repairing O-ring seal on primary feeder', time: '01:30 PM' },
        { label: 'Resolved', desc: 'Pressure stabilized at 4.2 bar; verified sanitary', time: '02:00 PM' },
      ],
    },
  ];

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(2); // In Progress by default

  const currentScenario = scenarios[activeScenarioIndex];

  const handleTicketLookup = (e) => {
    e.preventDefault();
    if (!ticketSearch.trim()) return;
    setSearchFeedback({
      ticketId: ticketSearch.trim().toUpperCase(),
      status: 'In Progress',
      note: 'Technician team dispatched to inspect facility.',
    });
  };

  return (
    <div className="home-page">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="editorial-hero">
        <div className="container hero-grid">
          <div className="hero-content">
            {/* Live Status Ticker */}
            <div className="hero-pill" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <div className="sim-pulse-dot" />
              <span style={{ color: '#065f46', fontWeight: 700, letterSpacing: '0.04em' }}>
                CAMPUS DISPATCH SYSTEM ONLINE
              </span>
            </div>

            <h1 className="hero-title">
              Your Voice, Our Campus, <br />
              <span className="hero-title-highlight">Resolved Together.</span>
            </h1>

            <p className="hero-subtitle">
              CampusCare connects students directly with university maintenance and faculty administration.
              Report facility faults, track live technician dispatch with verified turnaround guarantees,
              and maintain a world-class academic environment.
            </p>

            {/* Quick Ticket Lookup Search Box */}
            <form onSubmit={handleTicketLookup} style={{ marginBottom: '1.75rem', maxWidth: 460 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '2px solid #a7f3d0',
                  borderRadius: 12,
                  padding: '0.35rem 0.5rem',
                  boxShadow: '0 4px 12px rgba(6, 78, 59, 0.06)',
                }}
              >
                <Search size={18} color="#059669" style={{ marginLeft: 8 }} />
                <input
                  type="text"
                  placeholder="Have a Ticket ID? (e.g. CC-104)..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: 8 }}
                >
                  Track
                </button>
              </div>

              {searchFeedback && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 10,
                    padding: '0.75rem 1rem',
                    fontSize: '0.825rem',
                    color: '#064e3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>#{searchFeedback.ticketId}</strong>: {searchFeedback.status} — {searchFeedback.note}
                  </div>
                  <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline', color: '#059669' }}>
                    Sign in to view details →
                  </Link>
                </div>
              )}
            </form>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary btn-lg">
                <GraduationCap size={20} />
                <span>Student Incident Portal</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <Shield size={18} />
                <span>Administration Access</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Real Photography with Glass Floating Widgets */}
          <div className="hero-visual-wrapper">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
              alt="University Campus Architecture"
              className="hero-main-photo"
            />

            {/* Top Floating Glass Badge */}
            <div className="hero-floating-top-card">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#111827' }}>Live Campus Dispatch</strong>
                <span style={{ fontSize: '0.725rem', color: '#6b7280' }}>Technician on-site in Block C</span>
              </div>
            </div>

            {/* Bottom Floating Glass Card */}
            <div className="hero-floating-glass-card">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#111827' }}>
                  Audited Resolution Guarantee
                </strong>
                <span style={{ fontSize: '0.785rem', color: '#6b7280' }}>
                  Average turnaround under 3.2 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Incident Resolution Playground */}
      <section style={{ padding: '4rem 0', background: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 2.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
              }}
            >
              Interactive Dispatch Sandbox
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.75rem', color: '#111827' }}>
              Experience How Campus Incidents Get Resolved
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Click between realistic campus incident scenarios below to observe how CampusCare coordinates
              automatic triage, technician dispatch, and verified closure.
            </p>
          </div>

          <div className="sim-playground">
            {/* Tabs */}
            <div className="sim-nav">
              {scenarios.map((sc, idx) => {
                const Icon = sc.icon;
                return (
                  <button
                    key={sc.id}
                    className={`sim-tab ${idx === activeScenarioIndex ? 'active' : ''}`}
                    onClick={() => {
                      setActiveScenarioIndex(idx);
                      setCurrentStageIndex(2);
                    }}
                  >
                    <Icon size={16} />
                    <span>{sc.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Simulation Content */}
            <div className="sim-content">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#065f46',
                      background: '#d1fae5',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 6,
                    }}
                  >
                    {currentScenario.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{currentScenario.location}</span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: '#111827', marginBottom: '0.75rem' }}>
                  {currentScenario.title}
                </h3>

                {/* Progress Stepper Buttons */}
                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Click a Lifecycle Stage to Preview:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {currentScenario.stages.map((stage, sIdx) => {
                      const isActive = sIdx === currentStageIndex;
                      const isPast = sIdx < currentStageIndex;
                      return (
                        <button
                          key={stage.label}
                          onClick={() => setCurrentStageIndex(sIdx)}
                          style={{
                            padding: '0.6rem 0.5rem',
                            borderRadius: 8,
                            border: isActive ? '2px solid #059669' : '1px solid #e5e7eb',
                            background: isActive ? '#ecfdf5' : isPast ? '#f9fafb' : '#ffffff',
                            color: isActive ? '#064e3b' : isPast ? '#059669' : '#6b7280',
                            fontWeight: isActive ? 700 : 550,
                            fontSize: '0.775rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <span>{sIdx + 1}. {stage.label}</span>
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{stage.time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Stage Callout */}
                <div
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderLeft: '4px solid #059669',
                    borderRadius: 8,
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                    Current State: {currentScenario.stages[currentStageIndex].label}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#4b5563', margin: 0 }}>
                    {currentScenario.stages[currentStageIndex].desc}
                  </p>
                </div>
              </div>

              {/* Real-time Telemetry Panel */}
              <div className="sim-telemetry-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="sim-pulse-dot" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                      DISPATCH TELEMETRY
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#a7f3d0', fontFamily: 'monospace' }}>
                    LIVE FEED
                  </span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase' }}>Assigned Engineer</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    {currentScenario.technician}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase' }}>SLA Commitment</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>
                    {currentScenario.initialSla}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0', textTransform: 'uppercase' }}>Campus Target Metric</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                    99.4% On-Time Resolution
                  </div>
                </div>

                <Link
                  to="/student/submit"
                  className="btn"
                  style={{
                    background: '#10b981',
                    color: '#064e3b',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  File Your Own Complaint →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Coverage Showcase */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#059669',
              }}
            >
              University Infrastructure
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>
              Complete Campus Facility Coverage
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              From student residence halls to heavy equipment research laboratories, CampusCare covers every
              corner of campus operations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                icon: Wifi,
                title: 'High-Density Wi-Fi & IT',
                desc: 'Auditoriums, libraries, quad access points, and dorm Ethernet ports.',
                status: 'Operational',
              },
              {
                icon: Zap,
                title: 'Power & Lab Electrics',
                desc: '3-phase supply, UPS backup systems, circuit breakers, and laboratory ventilation.',
                status: 'Operational',
              },
              {
                icon: Droplet,
                title: 'Plumbing & Clean Water',
                desc: 'Reverse-osmosis dispensers, washroom fixtures, and hot water heaters.',
                status: 'Operational',
              },
              {
                icon: Building,
                title: 'Hostels & Residential Halls',
                desc: 'Doors, window glazing, HVAC temperature controls, and structural maintenance.',
                status: 'Operational',
              },
              {
                icon: Activity,
                title: 'Academic Lecture Theatres',
                desc: 'Projectors, acoustic panels, ergonomic desks, and smart podiums.',
                status: 'Operational',
              },
              {
                icon: ShieldCheck,
                title: 'Campus Safety & Lighting',
                desc: 'Night pathway luminaires, emergency sirens, and access control card readers.',
                status: 'Operational',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: '1.5rem',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover-card-elevated"
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', color: '#111827', margin: 0 }}>{item.title}</h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#ecfdf5',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 4,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Turnaround SLA Guarantees */}
      <section style={{ padding: '4rem 0', background: '#064e3b', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#a7f3d0',
              }}
            >
              Service Level Guarantees
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem', color: '#ffffff' }}>
              Predictable, Transparent Turnaround Times
            </h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.95rem' }}>
              Every complaint filed on CampusCare comes with an automated SLA countdown timer monitored by
              senior administration.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: '2rem',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                &lt; 2 Hours
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Critical & Emergency
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#d1fae5', lineHeight: 1.5 }}>
                Power failures in laboratories, active pipe ruptures, gas valve alerts, and urgent safety hazards.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: '2rem',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                &lt; 6 Hours
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Priority Academic & IT
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#d1fae5', lineHeight: 1.5 }}>
                Lecture hall AV equipment malfunctions, hostel Wi-Fi floor switch degradation, and water cooler repairs.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 16,
                padding: '2rem',
              }}
            >
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
                &lt; 24 Hours
              </div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Standard Routine Maintenance
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#d1fae5', lineHeight: 1.5 }}>
                Carpentry, desk adjustments, non-urgent lighting replacement, and general facility upgrades.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default HomePage;
