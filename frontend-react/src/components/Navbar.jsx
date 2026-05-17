import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/navbar.css';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Admission', path: '/admission' },
  { name: 'Contact', path: '/contact' },
  { name: 'Login', path: '/login' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavClass = ({ isActive }) => {
    return `nav-link ${isActive ? 'active' : ''}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-mark" style={{fontSize: '0.75rem', textAlign: 'center'}}>ICE</span>
          <span style={{textTransform: 'uppercase'}}>IDEAL COMPUTER EDUCATION</span>
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
