import { useEffect, useState } from 'react';
import { courseService } from '../services/api';
import '../styles/pages.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAll();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = [...new Set(courses.map((course) => course.category).filter(Boolean))];
  const filteredCourses = filter === 'all'
    ? courses
    : courses.filter((course) => course.category === filter);

  return (
    <div className="courses-page">
      <section className="page-header">
        <h1>Our Courses</h1>
        <p>Explore our comprehensive range of IT training programs</p>
      </section>

      <section className="courses-container">
        <div className="filter-section">
          <h3>Filter Courses</h3>
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
          {loading ? (
            <p>Loading courses...</p>
          ) : filteredCourses.length > 0 ? (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <div key={course._id} className="course-card-detailed">
                  <div className="course-badge">{course.category || 'General'}</div>
                  <h3>{course.name}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>Duration: {course.duration}</span>
                    <span>Fees: Rs. {course.fees}</span>
                  </div>
                  <div className="course-footer">
                    <span className="course-level">Code: {course.code}</span>
                    <a className="btn btn-enroll" href="/admission">Enroll Now</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses found</p>
          )}
        </div>
      </section>
    </div>
  );
}
