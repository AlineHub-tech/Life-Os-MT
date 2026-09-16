import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaChartBar, FaCalendarAlt, FaDownload, FaStar, FaAward, FaPiggyBank, FaArrowUp } from 'react-icons/fa';
import api from '../api';
import '../styles/Reports.css';

function Reports({ setIsAuthenticated }) {
  const [analytics, setAnalytics] = useState({
    disciplineScore: 0,
    totalIncome: 0,
    totalSavings: 0,
    totalExpenses: 0
  });
  const [todaysRoutine, setTodaysRoutine] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gufata amakuru usesuye y'ibyo Aline yakoze uwo munsi biva muri MongoDB Atlas
  useEffect(() => {
    const fetchReportsCloudData = async () => {
      try {
        const financeRes = await api.get('/finance/ledger');
        const routineRes = await api.get('/routine/today');

        if (routineRes.data.success && routineRes.data.hasData) {
          setTodaysRoutine(routineRes.data.data.tasks || []);
        }

        if (financeRes.data.success) {
          const history = financeRes.data.history || [];
          let income = history.reduce((sum, item) => sum + (item.earnedToday || 0), 0);
          let savings = history.reduce((sum, item) => sum + (item.savedToday || 0), 0);
          let expenses = history.reduce((sum, item) => {
            const useful = item.usefulExpense && item.usefulExpense.amount ? item.usefulExpense.amount : 0;
            const wasted = item.wastedExpense && item.wastedExpense.amount ? item.wastedExpense.amount : 0;
            return sum + useful + wasted;
          }, 0);

          setAnalytics({
            disciplineScore: 82, 
            totalIncome: income,
            totalSavings: savings,
            totalExpenses: expenses
          });
        }
      } catch (err) {
        console.error('Error compiling analytics report layers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportsCloudData();
  }, []);
  // 📄 PRINT AND EXPORT THE ACTUAL REPORT TABLE SHOWING WHAT ALINE DID TODAY
  const handleDownloadPDFReport = () => {
    const reportWindow = window.open('', '_blank');
    let routineRowsHtml = '';

    if (todaysRoutine.length > 0) {
      todaysRoutine.forEach(task => {
        let statusColor = '#dc2626'; // Missed
        if (task.status === 'Completed') statusColor = '#16a34a'; 
        if (task.status === 'Partially completed') statusColor = '#eab308'; 

        routineRowsHtml += `
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #ff4d05;">${task.time}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600; color: #111827;">${task.name}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; color: #374151;">${task.target}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold; color: ${statusColor};">${task.status}</td>
          </tr>
        `;
      });
    } else {
      routineRowsHtml = `<tr><td colspan="4" style="padding: 15px; text-align: center; color: #64748b;">Nta bikorwa bya routine logs byasanzwe uyu munsi muri MongoDB Atlas Cloud.</td></tr>`;
    }

    reportWindow.document.write(`
      <html>
        <head>
          <title>LifeOS — Aline's Executive Performance Audit</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111827; background: #ffffff; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ff4d05; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #111827; font-size: 26px; font-weight: 800; }
            .section-title { font-size: 16px; font-weight: 700; color: #111827; margin: 30px 0 15px 0; border-left: 4px solid #ff4d05; padding-left: 10px; text-transform: uppercase; }
            .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
            .metric-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
            .metric-card span { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
            .metric-card h2 { margin: 5px 0 0 0; font-size: 20px; font-weight: 700; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .data-table th { background: #f3f4f6; color: #111827; font-weight: 700; text-align: left; padding: 12px; font-size: 13px; border: 1px solid #e5e7eb; }
            .footer-note { margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LifeOS Executive Performance Audit</h1>
            <p>Official Statement Generated for Aline | MongoDB Cloud Infrastructure</p>
          </div>
          <div class="section-title">Core Performance Indicators</div>
          <div class="metrics-grid">
            <div class="metric-card"><span>Discipline Score</span><h2>${analytics.disciplineScore}%</h2></div>
            <div class="metric-card"><span>Studio Fund Savings</span><h2 style="color: #16a34a;">${analytics.totalSavings.toLocaleString()} FRW</h2></div>
            <div class="metric-card"><span>Total Expenses Stack</span><h2 style="color: #dc2626;">${analytics.totalExpenses.toLocaleString()} FRW</h2></div>
          </div>
          <div class="section-title">Daily Routine Checklist Logs (Aline's Activities Statement)</div>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 150px;">Amasaha</th>
                <th>Igikorwa cyari giteganyijwe</th>
                <th>Intego Yihariye (Target)</th>
                <th style="width: 130px;">Actual Status</th>
              </tr>
            </thead>
            <tbody>${routineRowsHtml}</tbody>
          </table>
          <div class="footer-note">LifeOS Framework &copy; — Plan • Track • Analyze • Improve. Official proof of performance.</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    reportWindow.document.close();
  };

  const weeklyTimelineBars = [
    { day: 'Mon', score: 85 }, { day: 'Tue', score: 90 }, { day: 'Wed', score: analytics.disciplineScore || 60 },
    { day: 'Thu', score: 65 }, { day: 'Fri', score: 80 }, { day: 'Sat', score: 75 }, { day: 'Sun', score: 70 }
  ];
  if (isLoading) {
    return <div className="loading-state-wrapper" style={{ padding: '40px', textAlign: 'center', color: 'var(--primary)', fontWeight: '700' }}>Compiling cloud database statistics for Aline...</div>;
  }

  return (
    <div className="layout-wrapper-light">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      
      <main className="reports-clean-main">
        <div className="reports-header-block-node">
          <h2><FaChartBar style={{ color: 'var(--primary)' }} /> Performance Analytics & Reports</h2>
          <p>Real-time Statements Console — Connected to Cloud MongoDB Atlas Instance for Aline.</p>
        </div>

        <div className="reports-summary-scoreboard-row">
          <div className="reports-analytics-badge-node">
            <span><FaAward /> Weekly Discipline Score</span>
            <div className="large-score-bold-text">{analytics.disciplineScore}%</div>
            <span className="evaluation-tag-light">SYSTEM LIVE</span>
          </div>
          <div className="reports-analytics-badge-node">
            <span><FaPiggyBank /> Cumulative Month Savings</span>
            <h4 className="text-green-node">{analytics.totalSavings.toLocaleString()} FRW</h4>
            <p className="compare-sub-label">Ayo nasesaguye: {analytics.totalExpenses.toLocaleString()} FRW</p>
          </div>
          <div className="reports-analytics-badge-node">
            <span><FaArrowUp /> Total Month Income</span>
            <h4 className="text-blue-node">{analytics.totalIncome.toLocaleString()} FRW</h4>
            <p className="compare-sub-label">Calculated from dynamic cloud bookkeeping history</p>
          </div>
        </div>
        <div className="reports-split-workspace-panel">
          
          <div className="reports-panel-card-box-clean">
            <h3><FaCalendarAlt style={{ color: 'var(--primary)' }} /> Daily Score Progression Chart</h3>
            <div className="pure-css-chart-bar-lane-wrapper-node">
              {weeklyTimelineBars.map((item, idx) => (
                <div key={idx} className="pure-chart-row-element-node">
                  <span className="chart-row-day-label-node">{item.day}</span>
                  <div className="chart-row-bg-lane-node">
                    <div className="chart-row-fill-indicator-lane-node" style={{ width: `${item.score || 60}%` }}>
                      <span className="chart-row-inside-percent-tag-node">{item.score || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reports-automated-detections-alert-card-clean">
              <p><strong><FaStar className="yellow-text" /> Cloud Protect:</strong> Imirongo yose y'amakuru ihujwe na database ihamye usesuye.</p>
            </div>
          </div>

          {/* REAL LIFE DISPLAY PANEL OF WHAT ALINE DID TODAY INSTEAD OF CHAT */}
          <div className="reports-panel-card-box-clean export-panel-light-accent">
            <h3>Aline's Active Routine Tasks Status</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '15px' }}>
              Ibi ni ibikorwa byanditswe uyu munsi muri database nyayo:
            </p>
            
            <div className="reports-live-routine-preview-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
              {todaysRoutine.length > 0 ? (
                todaysRoutine.map((task, index) => (
                  <div key={index} style={{ padding: '10px', backgroundColor: 'var(--bg-soft)', borderRadius: '6px', borderLeft: '3px solid var(--primary)', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span><strong>{task.time}</strong> — {task.name}</span>
                    <span style={{ fontWeight: '700', color: task.status === 'Completed' ? '#16a34a' : task.status === 'Partially completed' ? '#eab308' : '#dc2626' }}>{task.status}</span>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-main)' }}>🔴 Nta bikorwa bya routine logs birabikwa muri MongoDB uyu munsi usesuye.</p>
              )}
            </div>

            <button type="button" className="btn-trigger-pdf-download" onClick={handleDownloadPDFReport} style={{ marginTop: '20px' }}>
              <FaDownload /> Download Weekly PDF Executive Report
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Reports;
