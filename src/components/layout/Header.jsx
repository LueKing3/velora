import { Menu, Search, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Header.css';

const pageInfo = {
  overview: { title: 'Overview', subtitle: 'Your financial snapshot' },
  transactions: { title: 'Transactions', subtitle: 'Manage your transactions' },
  analytics: { title: 'Analytics', subtitle: 'Deep dive into your finances' },
  budgets: { title: 'Budgets', subtitle: 'Track your spending limits' },
  settings: { title: 'Settings', subtitle: 'Configure your preferences' },
};

const Header = ({ onMenuClick, searchQuery, onSearchChange }) => {
  const { currentPage } = useApp();
  const info = pageInfo[currentPage] || pageInfo.overview;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{info.title}</h1>
          <p className="header-subtitle">{info.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <span className="header-date">{today}</span>
        <div className="header-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>
        <div className="header-avatar">
          <span>V</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
