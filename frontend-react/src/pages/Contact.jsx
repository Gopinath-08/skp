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
    setIsSubmitting(true);
    setSubmitted(false);
    setError('');

    try {
      await inquiryService.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (submitError) {
      console.error('Error submitting inquiry:', submitError);
      setError(submitError.response?.data?.message || 'Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header page-header-contact">
        <div>
          <span>Talk to us</span>
          <h1>Contact Ideal Computer Education</h1>
          <p>Ask about courses, fees, batches, certificates, or admission support.</p>
        </div>
      </section>

      <section className="contact-content page-shell">
        <div className="contact-info">
          <InfoCard number="01" title="Location">
            <strong>IDEAL COMPUTER EDUCATION</strong><br />
            NEAR DAV COLLEGE, TITILAGARH<br />
            DIST-BALANGIR, ODISHA, PIN-767033
          </InfoCard>
          <InfoCard number="02" title="Phone & WhatsApp">
            Call/WhatsApp: +91 91242 80311<br />
            Call/WhatsApp: +91 91242 80322
          </InfoCard>
          <InfoCard number="03" title="Sub Branch">
            Near Khariar Autonomous College, Khariar<br />
            Dist- Nuapada<br />
            Mob: +91 98610 04687 / +91 98271 04687
          </InfoCard>
          <InfoCard number="04" title="Email">
            iceworldtlg.in@gmail.com
          </InfoCard>
          <InfoCard number="05" title="Business Hours">
            Monday - Saturday<br />Morning and evening batches available
          </InfoCard>
        </div>

        <div className="contact-form-section">
          <h2>Send an inquiry</h2>
          <p className="form-note">Share your details and our team will contact you with the next step.</p>
          {submitted && (
            <div className="success-message">
              Thank you. Your message has been sent successfully. We will get back to you soon.
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
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Inquiry Type *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Admission">Admission</option>
                <option value="Fees">Fees</option>
                <option value="Certificate">Certificate</option>
                <option value="Batch Timing">Batch Timing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Type your message here"
                rows="6"
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <section className="map-section page-shell">
        <div>
          <span className="eyebrow">Visit us</span>
          <h2>Come in for course counseling</h2>
          <p>Discuss your goal, compare courses, and confirm batch timings before admission.</p>
        </div>
        <div className="map-placeholder" aria-label="Location placeholder">
          <p>Ideal Computer Education</p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ number, title, children }) {
  return (
    <div className="info-card">
      <div className="info-icon">{number}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
