import React from 'react';

const About = () => {
  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>About Internship Portal</h1>
          <p>Bridging the gap between talented students and innovative companies</p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Our Mission</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            We believe that every student deserves the opportunity to gain real-world experience, 
            and every company deserves access to fresh, talented minds. Our platform makes it easy 
            for students to discover and apply to internships that match their skills and interests, 
            while helping companies find the perfect interns to grow their teams.
          </p>
        </div>

        <h2 className="text-center" style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Why Choose Us?</h2>
        <div className="grid" style={{ marginBottom: '3rem' }}>
          <div className="card">
            <h3>🎯 Perfect Matches</h3>
            <p>Our smart matching algorithm connects students with internships that align with their skills, interests, and career goals.</p>
          </div>
          <div className="card">
            <h3>⚡ Fast & Easy</h3>
            <p>Simple application process - apply to multiple internships with just a few clicks. No complicated forms or lengthy procedures.</p>
          </div>
          <div className="card">
            <h3>🤝 Trusted Platform</h3>
            <p>We verify all companies and internship postings to ensure quality opportunities for students.</p>
          </div>
          <div className="card">
            <h3>📊 Track Progress</h3>
            <p>Dashboard to track all your applications, view status updates, and manage your internship journey.</p>
          </div>
          <div className="card">
            <h3>🌟 Top Companies</h3>
            <p>Access internships from leading companies across various industries and sectors.</p>
          </div>
          <div className="card">
            <h3>💼 Build Your Career</h3>
            <p>Gain valuable experience, develop skills, and build professional networks that last.</p>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', border: '2px solid var(--primary-color)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Our Story</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            Founded in 2024, Internship Portal was born from a simple observation: finding quality 
            internships was too difficult for students, and finding talented interns was too time-consuming 
            for companies.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1rem' }}>
            Our founders, having experienced both sides of this challenge, set out to create a platform 
            that would streamline the entire process. Today, we're proud to connect thousands of students 
            with amazing internship opportunities across India.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
            We're constantly improving our platform based on feedback from both students and companies, 
            ensuring that we remain the best internship platform in the country.
          </p>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Join Thousands of Success Stories</h2>
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card">
              <h3 style={{ fontSize: '3rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10,000+</h3>
              <p>Students Registered</p>
            </div>
            <div className="stat-card">
              <h3 style={{ fontSize: '3rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</h3>
              <p>Partner Companies</p>
            </div>
            <div className="stat-card">
              <h3 style={{ fontSize: '3rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5,000+</h3>
              <p>Internships Posted</p>
            </div>
            <div className="stat-card">
              <h3 style={{ fontSize: '3rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
