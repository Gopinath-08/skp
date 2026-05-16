import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
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
    _id: 'pgdca',
    name: 'PGDCA',
    code: 'PGDCA001',
    description: 'Advanced computer applications, database basics, office automation, and project-oriented learning.',
    duration: '12 months',
    fees: 15000,
    category: 'Advanced',
  },
  {
    _id: 'tally',
    name: 'Tally',
    code: 'TALLY001',
    description: 'Accounting, GST, inventory, billing, and day-to-day business reporting with Tally.',
    duration: '3 months',
    fees: 5000,
    category: 'Certification',
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAll();
        setCourses(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const visibleCourses = courses.length > 0 ? courses : fallbackCourses;

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
              <strong>12+</strong>
              <span>Courses</span>
            </div>
          </div>
        </div>
      </section>

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
            {visibleCourses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <span>{course.category || 'Course'}</span>
                  <h3>{course.name}</h3>
                </div>
                <p className="course-description">{course.description}</p>
                <div className="course-footer">
                  <span>{course.duration}</span>
                  <strong>Rs. {course.fees}</strong>
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
          <h3>12+</h3>
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
