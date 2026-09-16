import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaFingerprint } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🔌 Real Axios request directly connecting to your port 5000 Express Server
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password
      });

      if (response.data.success) {
        localStorage.setItem('lifeos_token', response.data.token);
        localStorage.setItem('lifeos_user_id', response.data.user.id);
        localStorage.setItem('lifeos_user_name', response.data.user.name);
        
        setIsAuthenticated(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Umutekano wanze gufunguka! Genzura server yawe.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-viewport-wrapper">
      <div className="login-card-container">
        
        <div className="login-branding-header">
          <div className="login-app-logo-wrapper">
            <img src="/logo.jpeg" alt="LifeOS Logo" className="login-corporate-logo" onError={(e) => { e.target.style.display = 'none'; }} />
            <FaFingerprint className="login-fallback-brand-icon" />
          </div>
          <h1>LifeOS</h1>
          <p className="login-subtitle">Your Personal Operating System</p>
          <div className="login-slogan-badge">Plan • Track • Analyze • Improve</div>
        </div>

        <form onSubmit={handleLoginSubmit} className="login-interactive-form">
          {error && <div className="login-error-alert-box">{error}</div>}
          
          <div className="login-input-field-group">
            <label>Email Address</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaEnvelope /></span>
              <input type="email" placeholder="admin@lifeos.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="login-input-field-group">
            <label>Password</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaLock /></span>
              <input type="password" placeholder="123456" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div className="login-form-meta-links">
            <span onClick={() => navigate('/forgot-password')} className="login-forgot-password-anchor" style={{cursor: 'pointer'}}>Wibagiwe Password?</span>
          </div>

          <button type="submit" className="login-submit-action-btn" disabled={isLoading}>
            {isLoading ? 'Iri kugenzura...' : 'Injira kuri Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
