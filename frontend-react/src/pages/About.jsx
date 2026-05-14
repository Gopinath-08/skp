import '../styles/pages.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="page-header">
        <h1>About Us</h1>
        <p>Learn more about Ideal Computer Education</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Ideal Computer Education, we are committed to providing world-class IT training 
            that empowers students and professionals to excel in their careers. We believe in 
            combining theoretical knowledge with practical skills to create well-rounded professionals.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            To be the leading platform for IT education in India, recognized for our quality 
            training, dedicated instructors, and successful alumni who are making a difference 
            in the technology industry.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Ideal Computer Education?</h2>
          <ul className="about-list">
            <li>✓ Experienced and certified instructors</li>
            <li>✓ Comprehensive curriculum covering latest technologies</li>
            <li>✓ Hands-on training with real-world projects</li>
            <li>✓ Flexible learning schedules</li>
            <li>✓ Affordable pricing with various payment options</li>
            <li>✓ Job placement assistance</li>
            <li>✓ Lifetime access to course materials</li>
            <li>✓ 24/7 student support</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement">
              <h3>500+</h3>
              <p>Students Trained</p>
            </div>
            <div className="achievement">
              <h3>50+</h3>
              <p>Courses Offered</p>
            </div>
            <div className="achievement">
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
            <div className="achievement">
              <h3>100+</h3>
              <p>Industry Partners</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Get In Touch</h2>
          <p>Have any questions? We'd love to hear from you!</p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </div>
      </section>
    </div>
  );
}
