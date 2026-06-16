import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService, noticeService, getAssetUrl } from '../services/api';
import { sortCoursesByPreferredOrder } from '../utils/courseOrder';
import '../styles/pages.css';

const fallbackCourses = [
  {
    _id: 'dca',
    name: 'DCA',
    code: 'DCA001',
    description: 'Diploma in Computer Applications with office tools, internet, and practical computer fundamentals.',
    duration: '6 months',
    fees: 8000,
    category: 'Basic',
  },
  {
    _id: 'adca',
    name: 'ADCA',
    code: 'ADCA001',
    description: 'Advanced diploma training for deeper office, software, and workplace computer skills.',
    duration: '12 months',
    fees: 12000,
    category: 'Advanced',
  },
  {
    _id: 'pgdca',
    name: 'PGDCA',
    code: 'PGDCA001',
    description: 'Post graduate computer applications with database basics, automation, and project practice.',
    duration: '12 months',
    fees: 15000,
    category: 'Advanced',
  },
  {
    _id: 'office-package',
    name: 'Office Package',
    code: 'OFFICE001',
    description: 'Word, Excel, PowerPoint, typing, internet, email, and practical office computer work.',
    duration: '3 months',
    fees: 5000,
    category: 'Basic',
  },
  {
    _id: 'tally-prime-gst',
    name: 'Tally Prime and GST',
    code: 'TALLYGST001',
    description: 'Accounting, GST, inventory, billing, and day-to-day business reporting with Tally Prime.',
    duration: '3 months',
    fees: 6000,
    category: 'Certification',
  },
  {
    _id: 'photoshop',
    name: 'Photoshop',
    code: 'PS001',
    description: 'Photo editing, poster design, social media creatives, and practical design basics.',
    duration: '2 months',
    fees: 6000,
    category: 'Skill Development',
  },
  {
    _id: 'cttc',
    name: 'CTTC',
    code: 'CTTC001',
    description: 'Typing practice focused on speed, accuracy, keyboard skills, and certificate preparation.',
    duration: '3 months',
    fees: 4000,
    category: 'Typing',
  },
  {
    _id: 'java',
    name: 'Java',
    code: 'JAVA001',
    description: 'Core Java programming with object-oriented concepts, logic building, and coding exercises.',
    duration: '4 months',
    fees: 10000,
    category: 'Advanced',
  },
  {
    _id: 'python',
    name: 'Python',
    code: 'PYTHON001',
    description: 'Python fundamentals, problem solving, file handling, and practical beginner projects.',
    duration: '4 months',
    fees: 10000,
    category: 'Advanced',
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAll();
        setCourses(sortCoursesByPreferredOrder(response.data).slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(sortCoursesByPreferredOrder(fallbackCourses));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeService.getAll();
        const priorityOrder = { Urgent: 1, High: 2, Medium: 3, Low: 4 };
        const sortedNotices = [...response.data].sort((first, second) => (
          (priorityOrder[first.priority] || 5) - (priorityOrder[second.priority] || 5)
        ));
        setNotices(sortedNotices.slice(0, 4));
      } catch (error) {
        console.error('Error fetching notices:', error);
        setNotices([]);
      }
    };
    fetchNotices();
  }, []);

  const visibleCourses = courses.length > 0 ? courses : fallbackCourses;
  const previewCourses = visibleCourses.slice(0, 6);

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">YOUR SUCCESS ! OUR MISSION</span>
          <h1 className="hero-title">IDEAL COMPUTER EDUCATION</h1>
          <p className="hero-subtitle">
            Learn job-ready IT, accounting, office, design, and programming skills with guided practice,
            certification, and local support in Titilagarh.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
            <Link to="/admission" className="btn btn-secondary">Apply Now</Link>
          </div>
        </div>

        <div className="hero-panel" aria-label="Training highlights">
          <div className="hero-panel-top">
            <span>Live skill lab</span>
            <strong>ICE</strong>
          </div>
          <div className="screen-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>500+</strong>
              <span>Students</span>
            </div>
            <div>
              <strong>9</strong>
              <span>Courses</span>
            </div>
          </div>
        </div>
      </section>

      {notices.length > 0 && (
        <section className="notice-board page-shell">
          <div className="section-heading">
            <span>Latest Updates</span>
            <h2>Notices</h2>
          </div>
          <div className="notice-grid">
            {notices.map((notice) => (
              <article key={notice.id} className={`notice-card priority-${String(notice.priority || 'medium').toLowerCase()}`}>
                <div className="notice-card-header">
                  <span>{notice.type || 'General'}</span>
                  <strong>{notice.priority || 'Medium'}</strong>
                </div>
                <h3>{notice.title}</h3>
                <p>{notice.content}</p>
                {notice.expiryDate && (
                  <small>Valid till {new Date(notice.expiryDate).toLocaleDateString()}</small>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="features-section">
        <div className="section-heading">
          <span>Why students choose us</span>
          <h2>Training that stays close to the work</h2>
        </div>
        <div className="features-grid">
          <FeatureCard icon="01" title="Experienced Faculty" text="Learn from instructors who focus on practical classroom guidance." />
          <FeatureCard icon="02" title="Computer Lab Practice" text="Build confidence through daily hands-on exercises and projects." />
          <FeatureCard icon="03" title="Recognized Certificates" text="Receive course completion certificates for your professional profile." />
          <FeatureCard icon="04" title="Career Guidance" text="Get help choosing courses, preparing basics, and planning your next step." />
        </div>
      </section>

      <section className="courses-preview">
        <div className="section-heading">
          <span>Popular programs</span>
          <h2>Choose your course</h2>
        </div>
        {loading ? (
          <p className="center-message">Loading courses...</p>
        ) : (
          <div className="courses-grid">
            {previewCourses.map((course) => (
              <div key={course.id || course._id || course.code} className="course-card">
                {course.image && (
                  <img
                    className="course-card-image"
                    src={getAssetUrl(course.image)}
                    alt={course.name}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="course-header">
                  <span>{course.category || 'Course'}</span>
                  <h3>{course.name}</h3>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-footer">
                  <span>{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="stats-section">
        <div className="stat">
          <h3>500+</h3>
          <p>Students Trained</p>
        </div>
        <div className="stat">
          <h3>9</h3>
          <p>Career Courses</p>
        </div>
        <div className="stat">
          <h3>95%</h3>
          <p>Practice Based</p>
        </div>
        <div className="stat">
          <h3>1:1</h3>
          <p>Student Support</p>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <h2>Ready to start your IT journey?</h2>
          <p>Send your admission inquiry and our team will help you choose the right course.</p>
        </div>
        <Link to="/admission" className="btn btn-large">Enroll Now</Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
