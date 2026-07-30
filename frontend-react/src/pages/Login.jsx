import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import logo from '../assets/logo.png';
import '../styles/pages.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      setFormData({ email: '', password: '' });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <span className="eyebrow">Admin access</span>
          <h1>Login to dashboard</h1>
          <p>Manage courses, students, fees, certificates, inquiries, notices, faculty, and gallery records.</p>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address / User ID</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email or user id"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>

            <button type="submit" className="btn btn-login" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Student admission inquiries are submitted from the admission page.</p>
            <Link to="/admission">Go to Admission</Link>
          </div>
        </div>

        <div className="login-image">
          <div className="login-illustration">
            <img src={logo} alt="ICE Logo" style={{ width: '120px', height: 'auto', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: 'var(--radius-xl)' }} />
            <h2>One place for institute data</h2>
            <p>Use your admin account to view live backend records and monitor new inquiries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
