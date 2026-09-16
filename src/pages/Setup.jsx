import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaClock, FaBookOpen, FaUserCheck, FaWallet, FaSave } from 'react-icons/fa';
import '../styles/Setup.css';

function Setup({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    wakeUpTime: '04:00',
    workTime: '07:45',
    githubCommitTime: '08:45',
    lunchTime: '12:15',
    studyTime: '13:20',
    bibleStudyTime: '15:00',
    gospelCodingTime: '16:30',
    moviePhoneTime: '18:00',
    savingTime: '21:10',
    dinnerReviewTime: '21:45',
    sleepTime: '23:10',
    savingsGoal: '1000000'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('lifeos_user_routine', JSON.stringify(formData));
    alert('Gahunda n\'intego z\'imari byatunganyijwe neza muri System!');
    navigate('/dashboard');
  };

  return (
    <div className="layout-wrapper-light">
      {/* Ongeyeho Navbar mu mutwe wa page */}
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <div className="setup-viewport-wrapper">
        <div className="setup-card-container">
          
          <div className="setup-corporate-header">
            <h2><FaUserCheck /> LifeOS Core Initialization</h2>
            <p>Tegura imirongo y'amasaha n'intego z'imari bigenga Operating System yawe nshya.</p>
          </div>

          <form onSubmit={handleSetupSubmit} className="setup-interactive-form">
            
            {/* Section 1: Morning Routine */}
            <fieldset className="setup-form-fieldset">
              <legend><FaClock /> Amasaha y'Akazi n'Umubiri</legend>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>Kubyuka, Senga & Sport (04:00 AM):</label>
                  <input type="time" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Kujya mu Kazi (07:45 AM):</label>
                  <input type="time" name="workTime" value={formData.workTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>GitHub Commit & Coding (08:45 AM):</label>
                  <input type="time" name="githubCommitTime" value={formData.githubCommitTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Lunch Break (12:15 AM):</label>
                  <input type="time" name="lunchTime" value={formData.lunchTime} onChange={handleInputChange} required />
                </div>
              </div>
            </fieldset>

            {/* Section 2: Learning & Spiritual growth */}
            <fieldset className="setup-form-fieldset">
              <legend><FaBookOpen /> Ubumenyi n'Umwuka</legend>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>Akazi & Kwiga Bishya (13:20 PM):</label>
                  <input type="time" name="studyTime" value={formData.studyTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Bible Study & Prayer (15:00 PM):</label>
                  <input type="time" name="bibleStudyTime" value={formData.bibleStudyTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>Gospel & Coding (16:30 PM):</label>
                  <input type="time" name="gospelCodingTime" value={formData.gospelCodingTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Phone & Movie Limit (18:00 PM):</label>
                  <input type="time" name="moviePhoneTime" value={formData.moviePhoneTime} onChange={handleInputChange} required />
                </div>
              </div>
            </fieldset>

            {/* Section 3: Bookkeeping & Savings */}
            <fieldset className="setup-form-fieldset">
              <legend><FaWallet /> Imari n'Isuzumwa rya Nimugoroba</legend>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>Saving & Gutaha (21:10 PM):</label>
                  <input type="time" name="savingTime" value={formData.savingTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Kurya & Day Review (21:45 PM):</label>
                  <input type="time" name="dinnerReviewTime" value={formData.dinnerReviewTime} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="setup-form-row">
                <div className="setup-form-group">
                  <label>Kuryama Bedtime (23:10 PM):</label>
                  <input type="time" name="sleepTime" value={formData.sleepTime} onChange={handleInputChange} required />
                </div>
                <div className="setup-form-group">
                  <label>Photography Studio Goal Target (FRW):</label>
                  <input type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleInputChange} min="500000" max="1000000" required />
                </div>
              </div>
            </fieldset>

            <button type="submit" className="setup-action-submit-btn">
              <FaSave /> Initialize System Framework
            </button>
          </form>
        </div>
      </div>

      {/* Ongeyeho Footer mu nshanduka ya page */}
      <Footer />
    </div>
  );
}

export default Setup;
