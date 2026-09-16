import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWallet, FaPlus, FaBook, FaArrowUp, FaArrowDown, FaPiggyBank, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Finance.css';

function Finance({ setIsAuthenticated }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ 
    totalIncome: 0, totalSavings: 0, totalExpenses: 0, availableBalance: 0, moneyLentPending: 0, moneyBorrowedPending: 0 
  });
  
  const [form, setForm] = useState({
    earnedToday: '', savedToday: '', usedUseful: 'Hoya', usefulAmount: '', usefulReason: '',
    wastedUseless: 'Hoya', wastedAmount: '', wastedReason: '', hasDebts: 'Hoya',
    debtOwedTo: '', debtAmount: '', debtPaid: 'Hoya', hasLent: 'Hoya',
    lentToPersons: [{ name: '', amount: '', paidBack: 'Hoya' }]
  });

  // Gufata amakuru y'umutungo mbumbe usesuye biva muri MongoDB Atlas
  const fetchFinancialLedger = async () => {
    try {
      const token = localStorage.getItem('lifeos_token');
      
      // ⚠️ FIXED: Hano twongeyeho Token neza muri Request Headers
      const response = await axios.get('http://localhost:5000/api/finance/ledger', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTransactions(response.data.history || []);
        setSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Error fetching data from database:', err);
    }
  };

  useEffect(() => {
    fetchFinancialLedger();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLentPersonChange = (index, field, value) => {
    const updatedPersons = [...form.lentToPersons];
    updatedPersons[index][field] = value;
    setForm({ ...form, lentToPersons: updatedPersons });
  };

  const handleAddLentPersonRow = () => {
    setForm({
      ...form,
      lentToPersons: [...form.lentToPersons, { name: '', amount: '', paidBack: 'Hoya' }]
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('lifeos_token');
      
      // ⚠️ FIXED: Injections ya headers token kugira ngo 401 ikemuke
      const response = await axios.post('http://localhost:5000/api/finance/record', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Imikoreshereze y\'imari yawe yabitswe neza muri MongoDB Atlas!');
        fetchFinancialLedger(); // Refresh amakuru ku mizingo
        
        // Reset Form layout fields
        setForm({
          earnedToday: '', savedToday: '', usedUseful: 'Hoya', usefulAmount: '', usefulReason: '',
          wastedUseless: 'Hoya', wastedAmount: '', wastedReason: '', hasDebts: 'Hoya',
          debtOwedTo: '', debtAmount: '', debtPaid: 'Hoya', hasLent: 'Hoya',
          lentToPersons: [{ name: '', amount: '', paidBack: 'Hoya' }]
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Guhuriza data ya finance muri database byanze!');
    }
  };
  return (
    <div className="layout-wrapper-light">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      
      <main className="finance-clean-main">
        <div className="finance-title-node">
          <h1><FaWallet style={{ color: 'var(--primary)' }} /> LifeOS Finance Operating Manager</h1>
          <p>Real Personal Bookkeeping Framework — Connected to Cloud MongoDB Atlas Instance.</p>
        </div>

        {/* Spreadsheets scoreboards cards components grids layout */}
        <div className="finance-numerical-matrix-grid">
          <div className="fin-data-node border-top-green">
            <span><FaArrowUp /> Total Income</span>
            <h2>{summary.totalIncome.toLocaleString()} FRW</h2>
          </div>
          <div className="fin-data-node border-top-primary">
            <span><FaPiggyBank /> Total Savings (Studio Fund)</span>
            <h2>{summary.totalSavings.toLocaleString()} FRW</h2>
          </div>
          <div className="fin-data-node border-top-red">
            <span><FaArrowDown /> Total Expenses / Wasted</span>
            <h2>{summary.totalExpenses.toLocaleString()} FRW</h2>
          </div>
          <div className="fin-data-node border-top-charcoal">
            <span>Available Balance</span>
            <h2 style={{ color: 'var(--primary)' }}>{summary.availableBalance.toLocaleString()} FRW</h2>
          </div>
        </div>

        <div className="finance-numerical-matrix-grid mini-debt-grid">
          <div className="fin-data-node border-top-green">
            <span>Money Lent (Ayo ubarwamo n'abandi)</span>
            <h3 style={{ color: '#16a34a' }}>{summary.moneyLentPending.toLocaleString()} FRW</h3>
          </div>
          <div className="fin-data-node border-top-orange">
            <span>Money Borrowed (Ayo urimo abandi)</span>
            <h3 style={{ color: '#ea580c' }}>{summary.moneyBorrowedPending.toLocaleString()} FRW</h3>
          </div>
        </div>

        <div className="finance-split-workspace-panel">
          <div className="workspace-card-box">
            <h3>Record Daily Financial Activity</h3>
            
            <form onSubmit={handleFormSubmit} className="pure-form-stack">
              <div className="form-field-node">
                <label>Ayo Nakoreye uwo munsi (FRW):</label>
                <input type="number" name="earnedToday" value={form.earnedToday} onChange={handleFormChange} placeholder="e.g. 20000" required />
              </div>

              <div className="form-field-node">
                <label>Ayo na Savinze uwo munsi (FRW):</label>
                <input type="number" name="savedToday" value={form.savedToday} onChange={handleFormChange} placeholder="e.g. 1500" required />
              </div>

              <div className="form-field-node">
                <label>Ese hari ayo wakoresheje uyu munsi mu bintu by'umumaro?</label>
                <select name="usedUseful" value={form.usedUseful} onChange={handleFormChange}>
                  <option value="Hoya">Hoya</option>
                  <option value="Yego">Yego</option>
                </select>
              </div>

              {form.usedUseful === 'Yego' && (
                <div className="conditional-form-sub-block">
                  <div className="form-field-node">
                    <label>Umubare w'ayaguzwemo iby'umumaro (FRW):</label>
                    <input type="number" name="usefulAmount" value={form.usefulAmount} onChange={handleFormChange} placeholder="e.g. 2500" required />
                  </div>
                  <div className="form-field-node">
                    <label>Ibyo Nayakoresheje / Icyo nakoze:</label>
                    <input type="text" name="usefulReason" value={form.usefulReason} onChange={handleFormChange} placeholder="e.g. Transport, Food" required />
                  </div>
                </div>
              )}

              <div className="form-field-node">
                <label>Ese hari ayo wanesesaguye mu bidafite umumaro?</label>
                <select name="wastedUseless" value={form.wastedUseless} onChange={handleFormChange}>
                  <option value="Hoya">Hoya</option>
                  <option value="Yego">Yego</option>
                </select>
              </div>

              {form.wastedUseless === 'Yego' && (
                <div className="conditional-form-sub-block alert-waste-bg">
                  <div className="form-field-node">
                    <label>Umubare w'ayasesaguwe (FRW):</label>
                    <input type="number" name="wastedAmount" value={form.wastedAmount} onChange={handleFormChange} placeholder="e.g. 1000" required />
                  </div>
                  <div className="form-field-node">
                    <label>Icyo nayakoresheje (Ikirangaza):</label>
                    <input type="text" name="wastedReason" value={form.wastedReason} onChange={handleFormChange} placeholder="e.g. Drinks, bets" required />
                  </div>
                </div>
              )}

              <div className="form-field-node">
                <label>Ese hari umuntu ubonereye ideni uyu munsi?</label>
                <select name="hasDebts" value={form.hasDebts} onChange={handleFormChange}>
                  <option value="Hoya">Hoya</option>
                  <option value="Yego">Yego</option>
                </select>
              </div>

              {form.hasDebts === 'Yego' && (
                <div className="conditional-form-sub-block">
                  <div className="form-field-node">
                    <label>Uwo waryatse (Person Name):</label>
                    <input type="text" name="debtOwedTo" value={form.debtOwedTo} onChange={handleFormChange} placeholder="e.g. John" required />
                  </div>
                  <div className="form-field-node">
                    <label>Uko iryo deni ryangana (FRW Amount):</label>
                    <input type="number" name="debtAmount" value={form.debtAmount} onChange={handleFormChange} placeholder="e.g. 5000" required />
                  </div>
                  <div className="form-field-node">
                    <label>Ese rya naryishyuye?</label>
                    <select name="debtPaid" value={form.debtPaid} onChange={handleFormChange}>
                      <option value="Hoya">Hoya</option>
                      <option value="Yego">Yego</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="form-field-node">
                <label>Ese hari abo wagurije amafaranga uyu munsi?</label>
                <select name="hasLent" value={form.hasLent} onChange={handleFormChange}>
                  <option value="Hoya">Hoya</option>
                  <option value="Yego">Yego</option>
                </select>
              </div>

              {form.hasLent === 'Yego' && (
                <div className="conditional-form-sub-block">
                  {form.lentToPersons.map((person, index) => (
                    <div key={index} className="dynamic-lent-row-grid">
                      <input type="text" placeholder="Amazina" value={person.name} onChange={(e) => handleLentPersonChange(index, 'name', e.target.value)} required />
                      <input type="number" placeholder="FRW" value={person.amount} onChange={(e) => handleLentPersonChange(index, 'amount', e.target.value)} required />
                      <select value={person.paidBack} onChange={(e) => handleLentPersonChange(index, 'paidBack', e.target.value)}>
                        <option value="Hoya">Pending</option>
                        <option value="Yego">Barayishye</option>
                      </select>
                    </div>
                  ))}
                  <button type="button" className="btn-add-more-lent" onClick={handleAddLentPersonRow}>+ Add person row</button>
                </div>
              )}

              <button type="submit" className="btn-submit-financial-entry">Commit Daily Registry Statement</button>
            </form>
          </div>

          <div className="workspace-card-box">
            <h3><FaBook style={{ color: 'var(--secondary)' }} /> Bookkeeping Statement Ledger History</h3>
            <div className="finance-cards-history-stack-row">
              {transactions.length > 0 ? (
                transactions.map(entry => (
                  <div key={entry._id || entry.id} className="ledger-history-card-row">
                    <div className="ledger-card-date-node">{entry.date}</div>
                    <div className="ledger-card-details-node">
                      <p>🍏 <strong>Income:</strong> +{entry.earnedToday.toLocaleString()} FRW</p>
                      <p>💎 <strong>Savings:</strong> +{entry.savedToday.toLocaleString()} FRW</p>
                      {entry.usefulExpense?.amount > 0 && <p>👜 <strong>Useful Expense:</strong> -{entry.usefulExpense.amount.toLocaleString()} FRW ({entry.usefulExpense.reason})</p>}
                      {entry.wastedExpense?.amount > 0 && <p style={{ color: '#dc2626' }}>🚨 <strong>Wasted:</strong> -{entry.wastedExpense.amount.toLocaleString()} FRW ({entry.wastedExpense.reason})</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>Nta makuru y'ukuri ari muri MongoDB Atlas.</p>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Finance;
