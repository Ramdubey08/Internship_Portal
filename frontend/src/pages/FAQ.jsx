import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const studentFAQs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Register' button, select 'Student' as your role, fill in your details including username, email, and password, and submit the form. You'll be able to login immediately after registration."
    },
    {
      question: "How do I apply for an internship?",
      answer: "Browse internships, click on one that interests you, review the details, and click the 'Apply' button. Make sure your profile is complete with your skills and resume before applying."
    },
    {
      question: "Can I apply to multiple internships?",
      answer: "Yes! You can apply to as many internships as you want. Track all your applications from your Dashboard under 'My Applications'."
    },
    {
      question: "How do I track my applications?",
      answer: "Go to your Dashboard and click on 'My Applications'. You'll see all internships you've applied to along with their current status (Pending, Accepted, or Rejected)."
    },
    {
      question: "Can I withdraw my application?",
      answer: "Currently, you cannot withdraw applications through the platform. If you need to withdraw, please contact the company directly or reach out to our support team."
    },
    {
      question: "Is the platform free for students?",
      answer: "Yes! Registration and applying to internships is completely free for all students. There are no hidden charges."
    },
    {
      question: "How do I update my profile?",
      answer: "Click on 'Profile' in the navigation menu. You can update your skills, bio, and upload your CV/resume there."
    }
  ];

  const companyFAQs = [
    {
      question: "How do I register as a company?",
      answer: "Click on 'Register', select 'Company' as your role, enter your company name along with other required details, and submit. You'll get access to post internships immediately."
    },
    {
      question: "How do I post an internship?",
      answer: "After logging in, go to your Dashboard and click 'Create Internship'. Fill in the internship details like title, description, duration, stipend, skills required, and location, then publish it."
    },
    {
      question: "How many internships can I post?",
      answer: "There's no limit! You can post as many internship opportunities as you need for your organization."
    },
    {
      question: "How do I view applications?",
      answer: "Go to your Dashboard and click on any internship you've posted. You'll see all applications with student details. You can review profiles, accept or reject applications."
    },
    {
      question: "Can I edit a posted internship?",
      answer: "Yes! Go to your posted internships, click on the one you want to edit, and you'll find an 'Edit' button to modify the details."
    },
    {
      question: "Is there a fee for posting internships?",
      answer: "Basic posting is free! We may introduce premium features in the future, but standard internship posting will always remain free."
    },
    {
      question: "How do I contact applicants?",
      answer: "When you review applications, you'll see the applicant's email address and can contact them directly for interviews or further discussions."
    }
  ];

  const generalFAQs = [
    {
      question: "What makes this platform different?",
      answer: "We focus on simplicity and efficiency. Our platform is designed to make the internship search and hiring process as smooth as possible for both students and companies."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We take data security seriously. All passwords are encrypted, and we follow industry-standard security practices to protect your information."
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can request account deletion by contacting our support team at support@internshipportal.com. We'll process your request within 48 hours."
    },
    {
      question: "Do you verify companies?",
      answer: "We verify basic company information during registration. However, we recommend students do their own research about companies before applying."
    },
    {
      question: "What if I face technical issues?",
      answer: "Contact our support team at support@internshipportal.com or call our helpline. We're here to help you Monday through Friday, 9 AM to 6 PM IST."
    }
  ];

  const FAQSection = ({ title, faqs, emoji }) => (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {emoji} {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => {
          const globalIndex = `${title}-${index}`;
          const isOpen = openIndex === globalIndex;
          
          return (
            <div 
              key={index} 
              className="card" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: isOpen ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
              }}
              onClick={() => toggleFAQ(globalIndex)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: isOpen ? '1rem' : '0' }}>
                  {faq.question}
                </h3>
                <span style={{ fontSize: '1.5rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ▼
                </span>
              </div>
              {isOpen && (
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.7',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our platform</p>
        </div>
      </div>

      <div className="container mt-4" style={{ marginBottom: '4rem' }}>
        <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Can't find what you're looking for?</h3>
          <p style={{ marginBottom: '1rem' }}>Our support team is here to help!</p>
          <a href="/contact" className="btn btn-primary">Contact Support</a>
        </div>

        <FAQSection title="For Students" faqs={studentFAQs} emoji="🎓" />
        <FAQSection title="For Companies" faqs={companyFAQs} emoji="🏢" />
        <FAQSection title="General Questions" faqs={generalFAQs} emoji="❓" />

        <div className="card" style={{ background: 'var(--light-bg)', textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Still have questions?</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            We're happy to help! Reach out to us anytime.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@internshipportal.com" className="btn btn-outline">
              📧 Email Us
            </a>
            <a href="/contact" className="btn btn-outline">
              💬 Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
