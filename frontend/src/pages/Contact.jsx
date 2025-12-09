import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <div className="container mt-4" style={{ marginBottom: '4rem' }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div className="card">
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Send us a Message</h2>
              
              {submitted && (
                <div className="alert alert-success">
                  ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Send Message 📧
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>📍 Contact Information</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📧 Email
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem' }}>
                  <a href="mailto:support@internshipportal.com" style={{ color: 'var(--primary-color)' }}>
                    support@internshipportal.com
                  </a>
                </p>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem' }}>
                  <a href="mailto:partnerships@internshipportal.com" style={{ color: 'var(--primary-color)' }}>
                    partnerships@internshipportal.com
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📞 Phone
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem' }}>
                  +91 1800-123-4567 (Toll Free)
                </p>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', fontSize: '0.9rem' }}>
                  Mon-Fri: 9:00 AM - 6:00 PM IST
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏢 Office Address
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', lineHeight: '1.6' }}>
                  Internship Portal Pvt. Ltd.<br />
                  123, Tech Park, Sector 5<br />
                  Bangalore, Karnataka - 560001<br />
                  India
                </p>
              </div>

              <div>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🌐 Follow Us
                </h4>
                <div style={{ marginLeft: '1.5rem', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a href="#" className="btn btn-secondary btn-sm">LinkedIn</a>
                  <a href="#" className="btn btn-secondary btn-sm">Twitter</a>
                  <a href="#" className="btn btn-secondary btn-sm">Instagram</a>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>💡 Quick Response</h3>
              <p style={{ lineHeight: '1.6' }}>
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call our support hotline.
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', background: 'var(--light-bg)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Frequently Asked Questions</h3>
          <p>
            Before reaching out, you might find your answer in our <a href="/faq" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>FAQ section</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
