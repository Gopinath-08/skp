import { useEffect, useState } from 'react';
import { courseService, getAssetUrl } from '../services/api';
import '../styles/pages.css';

const fallbackCourses = [
  {
    _id: 'dca',
    name: 'DCA',
    code: 'DCA001',
    category: 'Basic',
    duration: '6 months',
    fees: 8000,
    description: 'Diploma in Computer Applications covering computer fundamentals, office tools, typing, internet, and practical file work.',
  },
  {
    _id: 'pgdca',
    name: 'PGDCA',
    code: 'PGDCA001',
    category: 'Advanced',
    duration: '12 months',
    fees: 15000,
    description: 'Post Graduate Diploma in Computer Applications with database basics, office automation, and project practice.',
  },
  {
    _id: 'adca',
    name: 'ADCA',
    code: 'ADCA001',
    category: 'Advanced',
    duration: '9 months',
    fees: 12000,
    description: 'Advanced Diploma in Computer Applications for students who want deeper software and workplace computer skills.',
  },
  {
    _id: 'tally',
    name: 'Tally',
    code: 'TALLY001',
    category: 'Certification',
    duration: '3 months',
    fees: 5000,
    description: 'Accounting, GST, inventory, billing, and business reports using Tally for shop and office work.',
  },
  {
    _id: 'dtp',
    name: 'DTP',
    code: 'DTP001',
    category: 'Skill Development',
    duration: '4 months',
    fees: 6000,
    description: 'Desktop publishing basics for posters, documents, print layouts, and local business design needs.',
  },
  {
    _id: 'web',
    name: 'Web Development',
    code: 'WEB001',
    category: 'Advanced',
    duration: '8 months',
    fees: 18000,
    description: 'HTML, CSS, JavaScript, backend basics, and practical website projects for career-ready learning.',
  },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAll();
        setCourses(response.data.length > 0 ? response.data : fallbackCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses(fallbackCourses);
        setApiMessage('Showing course information while the live server is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = [...new Set(courses.map((course) => course.category).filter(Boolean))];
  const categoryCourses = filter === 'all'
    ? courses
    : courses.filter((course) => course.category === filter);
  const filteredCourses = categoryCourses.filter((course) => {
    const text = `${course.name} ${course.code} ${course.description} ${course.category}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="courses-page">
      <section className="page-header page-header-courses">
        <div>
          <span>Computer training programs</span>
          <h1>Courses for school, college, and career growth</h1>
          <p>Choose practical courses in office work, accounting, design, programming, and web skills.</p>
        </div>
      </section>

      <section className="courses-container page-shell">
        <div className="filter-section">
          <div>
            <h3>Find a course</h3>
            <p>Filter by category or search by name, code, or topic.</p>
          </div>
          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses"
          />
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="courses-list">
          {apiMessage && <div className="notice-inline">{apiMessage}</div>}
          {loading ? (
            <p className="center-message">Loading courses...</p>
          ) : filteredCourses.length > 0 ? (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <div key={course.id || course._id || course.code} className="course-card-detailed">
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
                  <div className="course-badge">{course.category || 'General'}</div>
                  <h3>{course.name}</h3>
                  <span className="course-code">{course.code}</span>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span><strong>Duration</strong>{course.duration}</span>
                    <span><strong>Fees</strong>Rs. {course.fees}</span>
                  </div>
                  <div className="course-footer">
                    <a className="btn btn-enroll" href="/admission">Enroll Now</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No courses found for your search.</p>
          )}
        </div>
      </section>
    </div>
  );
}
