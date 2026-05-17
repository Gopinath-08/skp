import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Admission', path: '/admission' },
  { name: 'Student Zone', path: '/student-zone' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavClass = ({ isActive }) => {
    return `nav-link ${isActive ? 'active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-image" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary-color), #3b82f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem', letterSpacing: '1px', boxShadow: 'var(--shadow-md)' }}>
            ICE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{textTransform: 'uppercase', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', fontSize: '1.05rem', color: 'var(--text-primary)'}}>IDEAL COMPUTER</span>
            <span style={{textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.65rem', letterSpacing: '0.15em', marginTop: '2px'}}>EDUCATION</span>
          </div>
        </Link>
        
        <button className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'menu-open' : ''}`}>
          {navItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink 
                to={item.path} 
                className={getNavClass} 
                onClick={() => {
                  setIsMenuOpen(false);
                  if (window.location.pathname === item.path) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
