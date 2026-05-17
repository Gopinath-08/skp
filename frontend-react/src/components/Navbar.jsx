import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
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
          <img src={logo} alt="Ideal Computer Education Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        
        <button className={`nav-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
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
