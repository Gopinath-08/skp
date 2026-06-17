import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { settingService } from '../services/api';
import '../styles/footer.css';

export default function Footer() {
  const location = useLocation();
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const loadVisitorCount = async () => {
      try {
        const hasTrackedVisit = sessionStorage.getItem('iceVisitorTracked') === 'true';
        const response = hasTrackedVisit
          ? await settingService.getVisitorCount()
          : await settingService.trackVisitor();

        sessionStorage.setItem('iceVisitorTracked', 'true');
        setVisitorCount(response.data.count);
      } catch (error) {
        console.error('Error loading visitor count:', error);
      }
    };

    loadVisitorCount();
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Ideal Computer Education provides premium IT training and professional career development.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section footer-contact">
            <h3>Contact</h3>
            <div className="contact-group">
              <h4>Main Branch</h4>
              <p>NEAR DAV AUTONOMOUS COLLEGE, TITILAGARH<br/>DIST-BALANGIR, ODISHA, PIN-767033</p>
              <p>Phone: +91 91242 80311, +91 91242 80322</p>
              <p>WhatsApp: +91 91242 80311, +91 91242 80322</p>
              <p>Email: iceworldtlg.in@gmail.com</p>
            </div>
            <div className="contact-group">
              <h4>Sub Branch</h4>
              <p>Near Khariar Autonomous college, Rajkhariar<br/>Dist- Nuapada, Odisha, PIN-766107</p>
              <p>Phone: +91 98610 04687, +91 98271 04687</p>
              <p>WhatsApp: +91 98610 04687</p>
              <p>Email: iceworldkrar.in@gmail.com</p>
            </div>
          </div>
          
          <div className="footer-section footer-social">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1CyGddFwpp/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.instagram.com/ice_titilagarh?igsh=MWsyYnNhZnl2eDdqZw==" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="visitor-count" aria-label="Site visitor count">
            <span>Site Visitors</span>
            <strong>{visitorCount === null ? '--' : visitorCount.toLocaleString('en-IN')}</strong>
          </div>
          <p>
            &copy; {new Date().getFullYear()} All Rights Reserved | <a href="https://www.codeyouridea.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>CodeYourIdea</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
