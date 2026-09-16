import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaClock, FaCalendarAlt, FaAward, FaPiggyBank } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [financeStats, setFinanceStats] = useState({ totalIncome: 0, totalSavings: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardCloudData = async () => {
      try {
        const token = localStorage.getItem('lifeos_token');
        
        // ⚠️ FIXED ACCURATE DATABASE DATE STRING SYNCHRONIZER
        const responseStats = await axios.get('http://localhost:5000/api/finance/ledger', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const responseRoutine = await axios.get('http://localhost:5000/api/routine/today', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (responseRoutine.data.success && responseRoutine.data.hasData) {
          setTodaysTasks(responseRoutine.data.data.tasks || []);
        }

        if (responseStats.data.success) {
          setFinanceStats({
            totalIncome: responseStats.data.summary.totalIncome || 0,
            totalSavings: responseStats.data.summary.totalSavings || 0
          });
        }
      } catch (err) {
        console.error('Error compiling dashboard analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardCloudData();
  }, []);

  const formattedDate = currentTime.toLocaleDateString('rw-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('rw-RW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const totalTasksCount = todaysTasks.length;
  const completedCount = todaysTasks.filter(t => t.status === 'Completed').length;
  const partialCount = todaysTasks.filter(t => t.status === 'Partially completed').length;
  const disciplineScore = totalTasksCount > 0 ? Math.round(((completedCount + (partialCount * 0.5)) / totalTasksCount) * 100) : 0;

  if (isLoading) {
    return <div className="dashboard-loading-spinner">Syncing LifeOS Real Dashboard Matrix...</div>;
  }

  return (
    <div className="layout-wrapper-light">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      
      <main className="dashboard-pro-main-layout">
        
        <div className="dashboard-marquee-banner">
          <div className="marquee-left-clock">
            <h2>{formattedTime}</h2>
            <p><FaCalendarAlt /> {formattedDate}</p>
          </div>
          <div className="marquee-right-slogan">
            <p><strong>Umuhigo si umuhigo, ni ukuwesa!</strong> Studio Fund yawe ya photography (Target: 500k-1M FRW) igomba kuzura paka ikamba.</p>
          </div>
        </div>

        <div className="dashboard-executive-metrics-grid">
          <div className="metric-pro-card border-accent-orange">
            <div className="metric-card-icon-wrapper"><FaAward /></div>
            <div className="metric-card-body">
              <span>Discipline Performance</span>
              <h2>{disciplineScore}%</h2>
              <div className="score-evaluation-indicator">
                {disciplineScore >= 80 ? 'EXCELLENT STATUS' : disciplineScore >= 50 ? 'KEEP IMPROVING' : 'NEEDS ATTENTION'}
              </div>
            </div>
          </div>

          <div className="metric-pro-card border-accent-green">
            <div className="metric-card-icon-wrapper"><FaPiggyBank /></div>
            <div className="metric-pro-card-body">
              <span>Studio Capital Fund</span>
              <h2>{financeStats.totalSavings.toLocaleString()} FRW</h2>
              <p className="sub-metric-meta-text">Income Logged: {financeStats.totalIncome.toLocaleString()} FRW</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content-panel-box">
          <div className="panel-box-header">
            <h3>Today's Habit Registry Status Checklist</h3>
            <p>Isesengura ry'imyitwarire yawe usesuye ku masaha (04:00 AM - 23:10 PM) biva muri MongoDB Atlas.</p>
          </div>

          <div className="dashboard-fluid-rows-stack">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((t, idx) => (
                <div key={t.id || t._id || idx} className={`dashboard-fluid-row-item row-state-${t.status.toLowerCase().replace(/ /g, '-')}`}>
                  <div className="task-row-left-meta">
                    <span className="task-row-time">{t.time}</span>
                    <strong className="task-row-name">{t.name}</strong>
                  </div>
                  <div className="task-row-right-status">
                    <span className={`task-badge-pill-node status-color-${t.status.toLowerCase().replace(/ /g, '-')}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="dashboard-empty-state-card">
                <p>Nta bikorwa bya routine logs birandikwa uyu munsi muri MongoDB Atlas cloud cluster.</p>
                <p className="sub-empty-text">Genda kuri paji ya <strong>"Routine"</strong> u-ticking imyitwarire yawe uze kubika gahunda yawe.</p>
              </div>
            )}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
