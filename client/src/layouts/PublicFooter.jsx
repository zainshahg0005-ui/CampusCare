import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer className="footer-wrapper" id="contact">
      <div className="container footer-container">
        <div className="footer-col brand-col">
          <div className="brand-logo footer-brand">
            <div className="brand-icon-box">
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <span className="brand-text">
              Campus<span className="brand-accent">Care</span>
            </span>
          </div>
          <p className="footer-tagline">
            Empowering students and campus administrators to collaborate seamlessly for a cleaner,
            safer, and better learning environment.
          </p>
          <div className="footer-copy">
            © {new Date().getFullYear()} CampusCare Inc. All rights reserved.
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Student / Admin Login</Link></li>
            <li><Link to="/register">Student Registration</Link></li>
            <li><a href="/#how-it-works">How It Works</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Categories</h4>
          <ul className="footer-links">
            <li><span>Classroom Maintenance</span></li>
            <li><span>Laboratory Equipment</span></li>
            <li><span>High-Speed Wi-Fi</span></li>
            <li><span>Washroom Hygiene</span></li>
            <li><span>Power & Electricity</span></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h4 className="footer-title">Campus Help Desk</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Campus Admin Block, Room 102, Main Campus</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+1 (800) 555-CARE / Ext: 409</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>support@campuscare.university.edu</span>
            </li>
          </ul>
          <div className="admin-access-note">
            <small>Are you a university staff member? Use the portal login with your admin credentials.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
