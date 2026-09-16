import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBullseye } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Login.css'; // Koresha styles za login z'umweru isanzwe

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('1000000');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 🔌 Connecting and saving your profile parameters directly to MongoDB Atlas
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        savingsGoal
      });

      if (response.data.success) {
        alert('Account yawe yaremwe neza muri MongoDB Cloud!');
        navigate('/login'); // Yohereze kuri login noneho yinjire
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kurema account byanze! Genzura server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-viewport-wrapper">
      <div className="login-card-container">
        
        <div className="login-branding-header">
          <h1>Create LifeOS Account</h1>
          <p className="login-subtitle">Anza urugendo nshya rwa discipline n'imari</p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="login-interactive-form">
          {error && <div className="login-error-alert-box">{error}</div>}
          
          <div className="login-input-field-group">
            <label>Full Name</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaUser /></span>
              <input type="text" placeholder="e.g. Eric Photography" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="login-input-field-group">
            <label>Email Address</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaEnvelope /></span>
              <input type="email" placeholder="admin@lifeos.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="login-input-field-group">
            <label>Secure Password</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaLock /></span>
              <input type="password" placeholder="Andika password urinda" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div className="login-input-field-group">
            <label>Photography Studio Goal Target (FRW)</label>
            <div className="login-input-with-icon-wrapper">
              <span className="login-field-icon"><FaBullseye /></span>
              <input type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="login-submit-action-btn" disabled={isLoading}>
            {isLoading ? 'Iri kurema...' : 'Register Account'}
          </button>
        </form>

        <div className="login-card-footer-notice">
          <p>Ufite Account? <span onClick={() => navigate('/login')} style={{color:'var(--primary)', cursor:'pointer', fontWeight:'700'}}>Log In</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
