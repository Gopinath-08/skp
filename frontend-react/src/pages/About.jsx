import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facultyService, getAssetUrl } from '../services/api';
import '../styles/pages.css';

export default function About() {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    facultyService.getAll()
      .then(res => {
        const displayOrder = [
          'JAGABALIA SAHU',
          'SANKALPA KUMAR DASH',
          'CHANDAN NARAYANA SAHU',
          'SUSHRITA NANDA',
          'RUTURAJ CHALAN',
          'DIPASIKHA PANDA',
          'KAPILESH NARAYANA SAHU'
        ];

        const sorted = res.data.sort((a, b) => {
          const aIndex = displayOrder.indexOf((a.name || '').toUpperCase());
          const bIndex = displayOrder.indexOf((b.name || '').toUpperCase());
          if (aIndex !== -1 || bIndex !== -1) {
            return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
          }
          return (a.name || '').localeCompare(b.name || '');
        });
        setFaculty(sorted);
      })
      .catch(err => console.error('Failed to fetch faculty:', err));
  }, []);
  return (
    <div className="about-page">
      <section className="page-header page-header-about">
        <div>
          <span>About Ideal Computer Education</span>
          <h1>Local computer training with practical classroom support</h1>
          <p>
            We help students and working learners build useful digital skills through guided practice,
            simple explanations, and course certificates.
          </p>
        </div>
      </section>

      <section className="about-hero page-shell">
        <div className="about-photo" aria-label="Students learning in computer lab"></div>
        <div className="about-intro">
          <span className="eyebrow">YOUR SUCCESS ! OUR MISSION</span>
          <h2>IDEAL COMPUTER EDUCATION</h2>
          <p>
            Focusing on practical IT training for everyday office work, accounting, design, programming, and career preparation. Each course is structured so students can practice on systems, ask questions, and build confidence step by step.
          </p>
          <div style={{marginTop: '2rem', marginBottom: '2rem', padding: '2rem', backgroundColor: 'var(--surface-light)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'}}>
             <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary-color)'}}></div>
             <span className="eyebrow" style={{marginBottom: '1rem'}}>Chairperson's Message</span>
             <blockquote style={{ fontSize: '1.125rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
               "Our mission is to empower the youth of Titilagarh and surrounding areas with high-quality, practical computer education. We believe that right digital skills are the foundation for a successful career in today's modern world. We are committed to your success."
             </blockquote>
             <div>
               <p style={{margin: 0, fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-primary)'}}>JAGABALIA SAHU</p>
               <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: 600}}>Chairperson-cum-Managing Director</p>
               <p style={{margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem'}}>MD Mob: +91 80184 04687</p>
             </div>
          </div>
          <div className="about-actions">
            <Link to="/courses" className="btn btn-primary">View Courses</Link>
            <Link to="/admission" className="btn btn-outline">Apply for Admission</Link>
          </div>
        </div>
      </section>

      <section className="values-section page-shell">
        <div className="section-heading">
          <span>What we stand for</span>
          <h2>Clear teaching, steady practice, useful outcomes</h2>
        </div>
        <div className="values-grid">
          <ValueCard title="Practical Skills" text="Students spend time on real exercises, forms, documents, accounts, designs, and projects." />
          <ValueCard title="Student Guidance" text="We help learners choose the right course based on their current level and career direction." />
          <ValueCard title="Affordable Learning" text="Courses are planned for local learners who need quality training without unnecessary complexity." />
          <ValueCard title="Certificate Support" text="Completion certificates help students show their learning during jobs, interviews, and admissions." />
        </div>
      </section>

      <section className="timeline-section">
        <div className="page-shell">
          <div className="section-heading">
            <span>How learning works</span>
            <h2>A simple path from inquiry to certificate</h2>
          </div>
          <div className="timeline-grid">
            <Step number="01" title="Course Counseling" text="Tell us your goal and current level. We suggest the right course and batch." />
            <Step number="02" title="Classroom Practice" text="Attend regular sessions, practice in the lab, and complete guided assignments." />
            <Step number="03" title="Project Review" text="Revise key topics and complete practical work that proves your understanding." />
            <Step number="04" title="Certification" text="Receive your completion certificate and guidance for your next learning step." />
          </div>
        </div>
      </section>

      {faculty.length > 0 && (
        <section className="faculty-section page-shell" style={{ marginBottom: '6rem' }}>
          <div className="section-heading">
            <span>Our Team</span>
            <h2>Meet Our Expert Faculty</h2>
          </div>
          <div className="faculty-grid">
            {faculty.map(f => (
              <div key={f.id} className="faculty-card">
                 <div className="faculty-photo-wrap">
                   {f.photo ? (
                     <img
                       className="faculty-photo"
                       src={getAssetUrl(f.photo)}
                       alt={f.name}
                       onError={(event) => {
                         event.currentTarget.style.display = 'none';
                       }}
                     />
                   ) : (
                     <div className="faculty-photo-placeholder">{getInitials(f.name)}</div>
                   )}
                 </div>
                 <h3>{f.name}</h3>
                 <p className="faculty-designation">{f.designation}</p>
                 <div className="faculty-details">
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                      {f.qualification || 'Qualification Not Specified'}
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {f.experience ? `${f.experience} Experience` : 'Experience Not Specified'}
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      {f.email || 'No email provided'}
                    </span>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      {f.phone || 'No phone provided'}
                    </span>
                 </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="about-stats page-shell">
        <div className="achievement">
          <h3>500+</h3>
          <p>Students Trained</p>
        </div>
        <div className="achievement">
          <h3>9</h3>
          <p>Career Courses</p>
        </div>
        <div className="achievement">
          <h3>95%</h3>
          <p>Practice Focused</p>
        </div>
        <div className="achievement">
          <h3>1:1</h3>
          <p>Student Support</p>
        </div>
      </section>
    </div>
  );
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'ICE';
}

function ValueCard({ title, text }) {
  return (
    <div className="value-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="timeline-card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
