import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { Bell, Store, CheckCircle2, User, Menu } from 'lucide-react';
import './DashboardHeader.css';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const { orders, userProfile, userRole } = useContext(StoreContext);
  const [isOnline, setIsOnline] = useState(true);

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY_FOR_PICKUP'
  ).length;

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="header-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={20} />
        </button>
        <div className="header-title-meta">
          <h1 className="dashboard-header-title">Delicious Bites</h1>
          <span className="store-sublabel">Store ID: #REST-1092 • NYC Flagship</span>
        </div>
      </div>

      <div className="header-right">
        {/* Online / Offline Toggle */}
        <div className="store-status-toggle">
          <button
            type="button"
            className={`status-toggle-pill ${isOnline ? 'online' : 'offline'}`}
            onClick={() => setIsOnline(!isOnline)}
            title="Toggle store receiving orders"
          >
            <span className="status-indicator-dot" />
            <span>Kitchen: {isOnline ? 'ACCEPTING ORDERS' : 'PAUSED'}</span>
          </button>
        </div>

        {/* Active Orders Notification Alert */}
        <div className="header-orders-alert">
          <Bell size={18} />
          {activeOrdersCount > 0 && (
            <span className="alert-count">{activeOrdersCount}</span>
          )}
        </div>

        {/* Profile Pill */}
        <div className="merchant-profile-chip">
          <div className="merchant-avatar">
            <User size={16} />
          </div>
          <div className="merchant-info">
            <span className="merchant-name">{userProfile.name}</span>
            <span className="merchant-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;