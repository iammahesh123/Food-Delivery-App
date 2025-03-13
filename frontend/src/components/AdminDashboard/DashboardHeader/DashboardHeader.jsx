import React from 'react';
import { Menu } from 'lucide-react';
import './DashboardHeader.css'; // Import the CSS file

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-header-title">Admin Dashboard</h1>
      {/* Menu button to toggle sidebar (hidden on small screens) */}
      <button
        onClick={onToggleSidebar}
        className="menu-button"
      >
        View Mode
      </button>
    </header>
  );
};

export default Header;