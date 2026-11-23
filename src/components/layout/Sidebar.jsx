import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Wallet, Settings, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage } = useApp();

  const handleNav = (id) => {
    setCurrentPage(id);
    if (window.innerWidth < 1024) onClose?.();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <motion.aside
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        initial={false}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#sideLogoGrad)" strokeWidth="1.5" fill="none"/>
                <path d="M16 8L22 11V21L16 24L10 21V11L16 8Z" fill="url(#sideLogoGrad)" opacity="0.3"/>
                <path d="M16 12L19 13.5V18.5L16 20L13 18.5V13.5L16 12Z" fill="url(#sideLogoGrad)"/>
                <defs>
                  <linearGradient id="sideLogoGrad" x1="4" y1="2" x2="28" y2="30">
                    <stop stopColor="#34d399"/>
                    <stop offset="1" stopColor="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">VELORA</span>
              <span className="logo-tagline">Finance Tracker</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => handleNav(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="nav-active-bg"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="nav-active-indicator" />}
              </motion.button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              <span>V</span>
            </div>
            <div className="user-info">
              <span className="user-name">User</span>
              <span className="user-plan">Personal</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
