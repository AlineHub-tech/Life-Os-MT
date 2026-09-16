import React from 'react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lifeos-footer-light">
      <div className="footer-fluid-container">
        <div className="footer-brand-meta">
          <p className="footer-copyright-notice">
            &copy; {currentYear} <span className="brand-accent-text">LifeOS Enterprise</span> — Personal Operating System
          </p>
        </div>
        <div className="footer-slogan-meta">
          <p className="footer-motto-text">Plan • Track • Analyze • Improve</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
