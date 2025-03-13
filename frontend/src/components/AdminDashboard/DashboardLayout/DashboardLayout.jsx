import React, { useState, useEffect } from 'react';
import Header from '../DashboardHeader/DashboardHeader';
import Sidebar from '../SideBar/SideBar';
import './DashboardLayout.css'; // Import the CSS file

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Collapse sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Expand sidebar on larger screens
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Fixed Header */}
      <div className="dashboard-header-container">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Sidebar and Content Area */}
      <div className="dashboard-main-content">
        {/* Sidebar */}
        <Sidebar isCollapsed={!isSidebarOpen} />

        {/* Content Area */}
        <div
          className={`content-area ${
            isSidebarOpen ? 'expanded' : 'collapsed'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;