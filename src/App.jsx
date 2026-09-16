import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Finance from './pages/Finance';
import Reports from './pages/Reports';

import './styles/Global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('lifeos_token') ? true : false
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        <Route path="/setup" element={isAuthenticated ? <Setup /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/routine" element={isAuthenticated ? <Routine setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/finance" element={isAuthenticated ? <Finance setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
