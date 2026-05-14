import { useState } from 'react';
import { inquiryService } from '../services/api';
import '../styles/pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await inquiryService.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setError(error.response?.data?.message || 'Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Location</h3>
            <p>Ideal Computer Education<br />XYZ Street, City Name<br />State, Country - PIN</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+91 (0) XXX-XXX-XXXX<br />+91 (0) YYY-YYY-YYYY<br />Mon - Fri: 9AM - 6PM</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>info@idealedu.com<br />support@idealedu.com<br />admissions@idealedu.com</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Type your message here..."
                rows="6"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <section className="map-section">
        <h2>Find Us Here</h2>
        <p>Visit our office to meet our team and explore the campus</p>
        <div className="map-placeholder">
          <p>📍 Google Maps Integration Coming Soon</p>
        </div>
      </section>
    </div>
  );
}
