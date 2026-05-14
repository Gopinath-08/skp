import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      const admin = response.data.admin;
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(admin));
      setFormData({ email: '', password: '' });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <p>Welcome back to Ideal Computer Education</p>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
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
                placeholder="Enter your password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="/admission">Create one</a></p>
            <p><a href="/contact">Forgot password?</a></p>
          </div>
        </div>

        <div className="login-image">
          <div className="login-illustration">
            <h2>Start Your Learning Journey</h2>
            <p>Access your courses, track progress, and achieve your goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
