import React, { useState, useEffect } from 'react';
import Header from '../DashboardHeader/DashboardHeader';
import Sidebar from '../SideBar/SideBar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <div className="dashboard-header-container">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Main Container: Sidebar + Content */}
      <div className="dashboard-main-content">
        <Sidebar
          isCollapsed={!isSidebarOpen}
          onToggleCollapse={toggleSidebar}
        />

        <main className="dashboard-content-area">
          <div className="dashboard-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;