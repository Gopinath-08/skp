import { useEffect, useState } from 'react';
import { courseService, inquiryService } from '../services/api';
import { sortCoursesByPreferredOrder } from '../utils/courseOrder';
import '../styles/pages.css';

const fallbackCourses = [
  { _id: 'dca', name: 'DCA' },
  { _id: 'adca', name: 'ADCA' },
  { _id: 'pgdca', name: 'PGDCA' },
  { _id: 'office-package', name: 'Office Package' },
  { _id: 'tally-prime-gst', name: 'Tally Prime and GST' },
  { _id: 'photoshop', name: 'Photoshop' },
  { _id: 'cttc', name: 'CTTC' },
  { _id: 'java', name: 'Java' },
  { _id: 'python', name: 'Python' },
];

const branches = [
  { name: 'Titilagarh', code: 'TLG' },
  { name: 'Rajkhariar', code: 'KHR' },
];

const studentCategories = ['SC', 'ST', 'General', 'OBC'];

export default function Admission() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    motherName: '',
    parentNumber: '',
    studentCategory: '',
    email: '',
    phone: '',
    address: '',
    branch: '',
    course: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAll();
        setCourses(sortCoursesByPreferredOrder(response.data.length > 0 ? response.data : fallbackCourses));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(sortCoursesByPreferredOrder(fallbackCourses));
      }
    };
    fetchCourses();
  }, []);

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
    setStatus({ type: '', message: '' });

    try {
      const details = [
        `Student Name: ${formData.name}`,
        `Mother Name: ${formData.motherName}`,
        `Parent Number: ${formData.parentNumber}`,
        `Student Category: ${formData.studentCategory}`,
        `Preferred Branch: ${formData.branch}`,
        `Address: ${formData.address}`,
        `Student Phone: ${formData.phone}`,
        `Email: ${formData.email}`,
        `Selected Course: ${formData.course}`,
        `Additional Message: ${formData.message || 'Admission application submitted from the website.'}`,
      ].join('\n');

      await inquiryService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        message: details,
      });
      setStatus({ type: 'success', message: 'Application submitted. We will contact you soon.' });
      setFormData({
        name: '',
        motherName: '',
        parentNumber: '',
        studentCategory: '',
        email: '',
        phone: '',
        address: '',
        branch: '',
        course: '',
        message: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to submit application. Please try again.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admission-page">
      <section className="page-header page-header-admission">
        <div>
          <span>Admissions open</span>
          <h1>Apply for a computer course</h1>
          <p>Submit your inquiry and our team will help you with course selection, fees, and batch timing.</p>
        </div>
      </section>

      <section className="admission-content page-shell">
        <div className="admission-info">
          <span className="eyebrow">How it works</span>
          <h2>Simple admission process</h2>
          <ol className="process-list">
            <li><strong>Submit Inquiry</strong> Share your details and preferred course.</li>
            <li><strong>Counseling Call</strong> Our team explains eligibility, fees, and batch timing.</li>
            <li><strong>Document Check</strong> Confirm basic student details for admission.</li>
            <li><strong>Fee Confirmation</strong> Complete registration and payment formalities.</li>
            <li><strong>Start Classes</strong> Join your batch and begin practical training.</li>
          </ol>
          <div className="admission-help">
            <h3>Need help choosing?</h3>
            <p>Pick any course now. We can update it after counseling if another course fits better.</p>
          </div>
        </div>

        <div className="admission-form-container">
          <h2>Admission inquiry</h2>
          <p className="form-note">This form creates an inquiry in the backend. Admin can view it after login.</p>
          {status.message && (
            <div className={status.type === 'success' ? 'success-message' : 'error-message'}>
              {status.message}
            </div>
          )}
          <form className="admission-form" onSubmit={handleSubmit}>
            <div className="form-grid two-columns">
              <div className="form-group">
                <label htmlFor="name">Student Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter student full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="motherName">Mother Name *</label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                  placeholder="Enter mother name"
                />
              </div>
            </div>

            <div className="form-grid two-columns">
              <div className="form-group">
                <label htmlFor="phone">Student Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter student phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentNumber">Parent Number *</label>
                <input
                  type="tel"
                  id="parentNumber"
                  name="parentNumber"
                  value={formData.parentNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter parent phone number"
                />
              </div>
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
              <label htmlFor="studentCategory">Student Category *</label>
              <select
                id="studentCategory"
                name="studentCategory"
                value={formData.studentCategory}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Student Category --</option>
                {studentCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="branch">Select Branch *</label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                  <option key={branch.name} value={branch.name}>
                    {branch.name} - ICE26{branch.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course">Select Course *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course.id || course._id || course.name} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Full Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter complete address"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you want to join this course"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>

      <section className="admission-faq">
        <div className="section-heading">
          <span>Questions</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-items">
          <div className="faq-item">
            <h3>What are the eligibility criteria?</h3>
            <p>Most of our courses require basic computer knowledge. Specific prerequisites vary by course.</p>
          </div>
          <div className="faq-item">
            <h3>Do I need prior programming experience?</h3>
            <p>No, we have courses for beginners. However, some advanced courses may require prior knowledge.</p>
          </div>
          <div className="faq-item">
            <h3>What is the course duration?</h3>
            <p>Course durations vary from 2 months to 12 months depending on the course.</p>
          </div>
          <div className="faq-item">
            <h3>Do you provide placement assistance?</h3>
            <p>Yes, we provide career support and job placement assistance to our graduates.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
