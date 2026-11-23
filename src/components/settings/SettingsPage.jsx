import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Palette, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supportedCurrencies, currencyConfig } from '../../utils/currency';
import './Settings.css';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const SettingsPage = () => {
  const { settings, updateSettings, resetAllData, clearAllData } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <motion.div className="settings-page" variants={container} initial="hidden" animate="show">
      <motion.div className="settings-section" variants={item}>
        <div className="settings-section-header">
          <Globe size={20} />
          <h3>Currency</h3>
        </div>
        <p className="settings-desc">Select your preferred currency for displaying amounts.</p>
        <div className="currency-options">
          {supportedCurrencies.map(code => {
            const conf = currencyConfig[code];
            return (
              <button
                key={code}
                className={`currency-option ${settings.currency === code ? 'currency-active' : ''}`}
                onClick={() => updateSettings({ currency: code })}
              >
                <span className="currency-symbol">{conf.symbol}</span>
                <span className="currency-code">{code}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div className="settings-section" variants={item}>
        <div className="settings-section-header">
          <RotateCcw size={20} />
          <h3>Restore Sample Data</h3>
        </div>
        <p className="settings-desc">Reset to the default sample transactions and budgets. This will replace all current data.</p>
        {showResetConfirm ? (
          <div className="confirm-actions">
            <div className="confirm-warning">
              <AlertTriangle size={16} />
              <span>This will replace all your current data. Are you sure?</span>
            </div>
            <div className="confirm-buttons">
              <button className="btn-danger" onClick={() => { resetAllData(); setShowResetConfirm(false); }}>Yes, Reset</button>
              <button className="btn-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn-outline" onClick={() => setShowResetConfirm(true)}>
            <RotateCcw size={16} /> Restore Sample Data
          </button>
        )}
      </motion.div>

      <motion.div className="settings-section settings-danger" variants={item}>
        <div className="settings-section-header">
          <Trash2 size={20} />
          <h3>Clear All Data</h3>
        </div>
        <p className="settings-desc">Permanently delete all transactions, budgets, and reset settings.</p>
        {showClearConfirm ? (
          <div className="confirm-actions">
            <div className="confirm-warning warning-danger">
              <AlertTriangle size={16} />
              <span>This action cannot be undone. All data will be permanently deleted.</span>
            </div>
            <div className="confirm-buttons">
              <button className="btn-danger" onClick={() => { clearAllData(); setShowClearConfirm(false); }}>Yes, Delete Everything</button>
              <button className="btn-secondary" onClick={() => setShowClearConfirm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn-danger-outline" onClick={() => setShowClearConfirm(true)}>
            <Trash2 size={16} /> Clear All Data
          </button>
        )}
      </motion.div>

      <motion.div className="settings-section" variants={item}>
        <div className="settings-about">
          <div className="about-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#aboutGrad)" strokeWidth="1.5" fill="none"/>
              <path d="M16 12L19 13.5V18.5L16 20L13 18.5V13.5L16 12Z" fill="url(#aboutGrad)"/>
              <defs>
                <linearGradient id="aboutGrad" x1="4" y1="2" x2="28" y2="30">
                  <stop stopColor="#34d399"/><stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
            <span>VELORA</span>
          </div>
          <p>Premium Personal Finance Tracker</p>
          <p className="about-version">Version 1.0.0</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
