import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Admission from './pages/Admission';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import StudentZone from './pages/StudentZone';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminOrLogin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');

  return (
    <div className="app">
      <Navbar />
      <main className="main-content" style={{ paddingTop: isAdminOrLogin ? '0' : '64px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-zone" element={<StudentZone />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      {!isAdminOrLogin && (
        <a 
          href="https://wa.me/919861004687" 
          className="whatsapp-float"
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.002 0C7.177 0 0.015 7.162 0.015 15.989c0 3.513 1.144 6.883 3.324 9.687L0 32l6.551-3.238c2.72 2.015 6.009 3.123 9.451 3.123 8.825 0 15.986-7.162 15.986-15.989C31.988 7.162 24.826 0 16.002 0z" fill="#25D366" />
            <path d="M24.717 19.344c-0.428-0.214-2.531-1.251-2.923-1.394-0.392-0.143-0.678-0.214-0.963 0.214-0.285 0.428-1.106 1.394-1.356 1.679-0.25 0.285-0.5 0.321-0.928 0.107-0.428-0.214-1.808-0.667-3.444-2.128-1.274-1.138-2.133-2.544-2.383-2.973-0.25-0.428-0.027-0.661 0.187-0.874 0.192-0.192 0.428-0.5 0.642-0.75 0.214-0.25 0.285-0.428 0.428-0.714 0.143-0.285 0.071-0.535-0.036-0.75-0.107-0.214-0.963-2.323-1.32-3.18-0.347-0.835-0.702-0.723-0.963-0.736-0.25-0.012-0.535-0.012-0.82-0.012-0.285 0-0.75 0.107-1.142 0.535-0.392 0.428-1.498 1.465-1.498 3.573 0 2.108 1.534 4.144 1.748 4.43 0.214 0.285 3.023 4.618 7.324 6.471 1.023 0.441 1.821 0.704 2.443 0.902 1.026 0.326 1.961 0.28 2.698 0.17 0.824-0.123 2.531-1.036 2.888-2.036 0.357-1 0.357-1.858 0.25-2.036-0.107-0.179-0.392-0.286-0.82-0.501z" fill="#FFF" />
          </svg>
        </a>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
