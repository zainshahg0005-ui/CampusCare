import React from 'react';
import { Link } from 'react-router-dom';
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
  CheckCheck,
  ChevronRight,
  Activity,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import PublicNavbar from '../layouts/PublicNavbar';
import PublicFooter from '../layouts/PublicFooter';

const HomePage = () => {
  return (
    <div className="home-page">
      <PublicNavbar />

      {/* Editorial Hero Section (No Ratings/Reviews, No Blue) */}
      <section className="editorial-hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={15} />
              <span>Campus Infrastructure Management System</span>
            </div>

            <h1 className="hero-title">
              Your Voice, Our Campus, <br />
              <span className="hero-title-highlight">Better Together.</span>
            </h1>

            <p className="hero-subtitle">
              CampusCare connects enrolled students directly with university maintenance and faculty
              administration. Report facility faults, track live technician dispatch, and maintain a
              sustainable, world-class learning environment.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Lodge a Complaint</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                <span>Access Portal</span>
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
                <CheckCheck size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#111827' }}>
                  Grievances Tracked Digitally
                </strong>
                <span style={{ fontSize: '0.785rem', color: '#6b7280' }}>
                  Real-time status updates directly from staff
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Department Trust Strip */}
      <section className="social-proof-strip">
        <div className="container">
          <div className="proof-logos-grid">
            <div className="proof-logo-item">
              <Building size={20} color="#059669" />
              <span>FACULTY OF ENGINEERING</span>
            </div>
            <div className="proof-logo-item">
              <Zap size={20} color="#059669" />
              <span>ELECTRICAL & MAINTENANCE</span>
            </div>
            <div className="proof-logo-item">
              <Wifi size={20} color="#059669" />
              <span>CAMPUS NETWORK SERVICES</span>
            </div>
            <div className="proof-logo-item">
              <Droplet size={20} color="#059669" />
              <span>CAMPUS SANITATION & WATER</span>
            </div>
            <div className="proof-logo-item">
              <ShieldCheck size={20} color="#059669" />
              <span>CAMPUS ESTATE OFFICE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Facilities Showcase Grid */}
      <section className="section" id="facilities">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Campus Infrastructure Coverage</p>
            <h2 className="section-title">Facilities Maintained by CampusCare</h2>
            <p className="section-desc">
              From laboratory sensors to lecture theatre seating, every facility request is handled systematically.
            </p>
          </div>

          <div className="category-showcase-grid">
            {/* Card 1: Classrooms */}
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
                alt="Lecture Theatres & Smart Classrooms"
                className="category-card-img"
              />
              <div className="category-card-body">
                <div>
                  <h3 className="category-card-title">Classrooms & Auditoriums</h3>
                  <p className="category-card-desc">
                    Projector flickering, broken seat desks, audio microphone issues, and HVAC temperature control.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="badge badge-resolved">Active Oversight</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Block A & B</span>
                </div>
              </div>
            </div>

            {/* Card 2: Laboratories */}
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                alt="Research Laboratories"
                className="category-card-img"
              />
              <div className="category-card-body">
                <div>
                  <h3 className="category-card-title">STEM & Research Labs</h3>
                  <p className="category-card-desc">
                    Fume hood airflow, microscope calibration, chemical sink drainage, and electrical safety switches.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="badge badge-resolved">Priority Queue</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Science Complex</span>
                </div>
              </div>
            </div>

            {/* Card 3: Internet & Wi-Fi */}
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                alt="Campus Gigabit Wi-Fi"
                className="category-card-img"
              />
              <div className="category-card-body">
                <div>
                  <h3 className="category-card-title">Campus Wi-Fi & Network</h3>
                  <p className="category-card-desc">
                    Dead zones in library study pods, slow hostel Wi-Fi, Ethernet port repairs, and portal sign-in errors.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="badge badge-in-progress">Network Monitoring</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>Campus-Wide</span>
                </div>
              </div>
            </div>

            {/* Card 4: Sanitation & Washrooms */}
            <div className="category-card">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
                alt="Sanitation & Utilities"
                className="category-card-img"
              />
              <div className="category-card-body">
                <div>
                  <h3 className="category-card-title">Sanitation & Water Supply</h3>
                  <p className="category-card-desc">
                    Water cooler filtration replacements, washroom plumbing, soap dispensers, and hygiene maintenance.
                  </p>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="badge badge-resolved">Hourly Inspection</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>All Quads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works with Visual Breadcrumbs */}
      <section className="section" id="how-it-works" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-tag">TRANSPARENT 4-STEP LIFECYCLE</p>
            <h2 className="section-title">How Tickets Move Through Resolution</h2>
            <p className="section-desc">
              Every submitted grievance triggers an accountable, timestamped university workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                1
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 750, marginBottom: '0.5rem' }}>Student Logs Ticket</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                Submit the building, classroom number, category, and an optional camera snapshot from your phone.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                2
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 750, marginBottom: '0.5rem' }}>Admin Dispatch</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                Facilities management verifies the request and dispatches certified electrical or plumbing personnel.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                3
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 750, marginBottom: '0.5rem' }}>Live Status Updates</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                Track the progress bar move from Pending to In-Progress with official technicians' progress remarks.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.25rem' }}>
                4
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 750, marginBottom: '0.5rem' }}>Verified Closure</h4>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.6 }}>
                The completed work is stamped, logged in MongoDB Atlas, and published back to your student dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* University CTA Strip (Deep Forest Green, Zero Blue) */}
      <section className="container" style={{ margin: '3rem auto 5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '4.5rem 3rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-pop)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 850, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to maintain our campus facilities?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#d1fae5', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Report issues quickly and help keep university classrooms, laboratories, and grounds in top condition.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ backgroundColor: '#ffffff', color: '#064e3b', fontWeight: 800 }}>
              <span>Create Student Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)', background: 'transparent' }}>
              <span>Sign In to Existing Portal</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default HomePage;
