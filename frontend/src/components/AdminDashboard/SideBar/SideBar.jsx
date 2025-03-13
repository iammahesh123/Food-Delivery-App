import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  FileText,
  Settings,
  BarChart,
  Users,
  Briefcase,
  PlusSquare,
  LogOut,
} from 'lucide-react';
import './Sidebar.css'; // Import the CSS file

const Sidebar = ({ isCollapsed }) => {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Navigation Links */}
      <nav className="nav-links">
        {/* Overview Link */}
        <Link to="/dashboard/" className="nav-link">
          <Home className="icon" />
          {!isCollapsed && <span className="label">Overview</span>}
        </Link>

        {/* Analytics Link */}
        <Link to="/dashboard/analytics" className="nav-link">
          <BarChart className="icon" />
          {!isCollapsed && <span className="label">Analytics</span>}
        </Link>

        {/* New Post Link */}
        <Link to="/dashboard/new-post" className="nav-link">
          <PlusSquare className="icon" />
          {!isCollapsed && <span className="label">New Post</span>}
        </Link>

        {/* New Project Link */}
        <Link to="/dashboard/new-project" className="nav-link">
          <PlusSquare className="icon" />
          {!isCollapsed && <span className="label">New Project</span>}
        </Link>

        {/* Posts Link */}
        <Link to="/dashboard/posts" className="nav-link">
          <FileText className="icon" />
          {!isCollapsed && <span className="label">View Posts</span>}
        </Link>

        {/* View Services */}
        <Link to="/dashboard/services" className="nav-link">
          <Briefcase className="icon" />
          {!isCollapsed && <span className="label">Services Requests</span>}
        </Link>

        {/* Messages Link */}
        <Link to="/dashboard/messages" className="nav-link">
          <Users className="icon" />
          {!isCollapsed && <span className="label">View Messages</span>}
        </Link>

        {/* Settings Link */}
        <Link to="/dashboard/settings" className="nav-link">
          <Settings className="icon" />
          {!isCollapsed && <span className="label">Settings</span>}
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="logout-section">
        <Link to="/logout" className="nav-link">
          <LogOut className="icon" />
          {!isCollapsed && <span className="label">Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;