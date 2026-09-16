import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaWallet, FaChartLine, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logoImg from '../assets/logo.jpeg'; // Real corporate reference
import '../styles/Navbar.css';

function Navbar({ setIsAuthenticated }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('lifeos_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="lifeos-navbar-light">
      <div className="navbar-brand-node">
        <img src={logoImg} alt="LifeOS Asset Logo" className="navbar-asset-logo-img" />
        <span className="logo-text-node">LifeOS</span>
      </div>

      <div className="mobile-toggle-trigger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`navbar-links-lane ${isMobileMenuOpen ? 'active' : ''}`}>
        <li><Link to="/dashboard" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaChartLine /> Dashboard</Link></li>
        <li><Link to="/routine" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaClock /> Routine</Link></li>
        <li><Link to="/finance" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaWallet /> Finance</Link></li>
        <li><Link to="/reports" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaChartLine /> Reports</Link></li>
        <li><Link to="/setup" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaCog /> Setup</Link></li>
        {/* <li><Link to="/profile" className="nav-item-node" onClick={() => setIsMobileMenuOpen(false)}><FaUser /> Profile</Link></li> */}
        <li className="mobile-only-logout-lane">
          <button onClick={handleLogout} className="btn-logout-mobile-node">Logout</button>
        </li>
      </ul>

      <div className="navbar-actions-desktop-node">
        <button onClick={handleLogout} className="btn-logout-node">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
