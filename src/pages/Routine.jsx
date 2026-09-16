import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaClock, FaCheck, FaTimes, FaMinus, FaSave } from 'react-icons/fa';
import api from '../api';
import '../styles/Routine.css';

function Routine({ setIsAuthenticated }) {
  const defaultRoutineSchema = [
    { id: 1, time: '04:00 AM - 05:00 AM', name: 'Wake up, Pray, Sport & Hygiene', target: 'Kubyuka, senga, sport, koga n\'isuku' },
    { id: 2, time: '07:45 AM - 08:00 AM', name: 'Kujya mu Kazi', target: 'Kuba wageze ku kazi ku gihe adacererewe' },
    { id: 3, time: '08:45 AM - 12:00 AM', name: 'GitHub Commit & Tech Work', target: 'GitHub commit, graphic review, editing cg coding' },
    { id: 4, time: '12:15 AM - 13:15 PM', name: 'LUNCH BREAK', target: 'Kurya no kuruhuka neza' },
    { id: 5, time: '13:20 PM - 15:00 PM', name: 'Akazi & Kwiga Bishya', target: 'Gukora akazi k\'umunsi no kwiga bishya' },
    { id: 6, time: '15:00 PM - 16:30 PM', name: 'Bible Study & Prayer', target: 'Gusoma bible, bible study no gusenga' },
    { id: 7, time: '16:30 PM - 18:00 PM', name: 'Gospel Music & Coding', target: 'Kumva indirimbo za gospel na gucodinga' },
    { id: 8, time: '18:00 PM - 20:30 PM', name: 'Phone Control & Movie', target: 'Kureba movie no gufunga social media limits' },
    { id: 9, time: '21:10 PM', name: 'Saving & Gutaha', target: 'Kwandika imyandiko y\'imari no gutaha' },
    { id: 10, time: '21:45 PM - 23:00 PM', name: 'Kurya & Day Review', target: 'Kurya no kureba review y\'uko umunsi wagenze' },
    { id: 11, time: '23:10 PM', name: 'Kuryama (Bedtime boundaries)', target: 'Kuryama adatinze hafi y\'uburyamo' }
  ];

  const [tasks, setTasks] = useState([]);
  const [phoneOveruse, setPhoneOveruse] = useState('Biri hagati');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayRoutine = async () => {
      try {
        const response = await api.get('/routine/today');
        if (response.data.success && response.data.hasData) {
          setTasks(response.data.data.tasks);
          setPhoneOveruse(response.data.data.phoneOveruse || 'Biri hagati');
        } else {
          setTasks(defaultRoutineSchema.map(t => ({ ...t, status: 'Pending' })));
        }
      } catch (err) {
        console.error('Error fetching routine:', err);
        setTasks(defaultRoutineSchema.map(t => ({ ...t, status: 'Pending' })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayRoutine();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleSaveRoutineLog = async () => {
    try {
      const response = await api.post('/routine/record', { tasks, phoneOveruse });
      if (response.data.success) {
        alert("Gahunda y'umunsi (Checklist Logs) yabitswe neza muri MongoDB Atlas Cloud!");
      }
    } catch (err) {
      console.error(err);
      alert("Guhuriza data ya routine muri database byanze!");
    }
  };

  if (isLoading) {
    return <div className="loading-state-wrapper" style={{padding:'40px', textAlign:'center', fontWeight:'700', color:'var(--primary)'}}>Loading lifestyle framework metrics...</div>;
  }

  return (
    <div className="layout-wrapper-light">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      
      <main className="routine-light-container">
        <div className="routine-header-block">
          <h2>Daily Routine Action Checklist</h2>
          <p>Mesa imyitwarire yawe ugereranyije n'amasaha waduhaye. Buri action igomba kuba isobanutse neza.</p>
        </div>

        <div className="routine-flex-ledger-container">
          {tasks.map(t => (
            <div key={t.id} className={`routine-flex-row-card state-${t.status.toLowerCase().replace(/ /g, '-')}`}>
              <div className="routine-card-meta-info">
                <span className="routine-card-time">{t.time}</span>
                <h4 className="routine-card-title">{t.name}</h4>
                <p className="routine-card-target">{t.target}</p>
              </div>

              <div className="routine-card-actions-area">
                <div className="checklist-buttons-vertical-stack">
                  <button type="button" className={`btn-action-node done ${t.status === 'Completed' ? 'active' : ''}`} onClick={() => handleStatusChange(t.id, 'Completed')}>
                    <FaCheck /> <span>Completed</span>
                  </button>
                  <button type="button" className={`btn-action-node partial ${t.status === 'Partially completed' ? 'active' : ''}`} onClick={() => handleStatusChange(t.id, 'Partially completed')}>
                    <FaMinus /> <span>Partial</span>
                  </button>
                  <button type="button" className={`btn-action-node missed ${t.status === 'Missed' ? 'active' : ''}`} onClick={() => handleStatusChange(t.id, 'Missed')}>
                    <FaTimes /> <span>Missed</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="routine-phone-tracker-widget-box">
          <h3>Ese wakoresheje phone cyane ugiye kuryama (23:10 PM) cyangwa ubyutse gitondo?</h3>
          <div className="phone-selection-row">
            {['Yego', 'Hoya', 'Biri hagati'].map(opt => (
              <button key={opt} className={`btn-phone-selector-light ${phoneOveruse === opt ? 'active-light-phone' : ''}`} onClick={() => setPhoneOveruse(opt)}>{opt}</button>
            ))}
          </div>
          <button className="btn-commit-routine-save" onClick={handleSaveRoutineLog}><FaSave /> Commit Daily Log Matrix</button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Routine;
