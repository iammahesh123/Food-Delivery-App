import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ChefHat,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  Ticket,
} from 'lucide-react';
import { StoreContext } from '../../../context/StoreContext';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { userRole, handleLogout } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-brand-row">
        {!isCollapsed && (
          <div className="brand-info">
            <span className="brand-title">Merchant Hub</span>
            <span className="brand-role-chip">{userRole}</span>
          </div>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="collapse-toggle-btn"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav-list" aria-label="Operations Navigation">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Overview</span>}
        </NavLink>

        <NavLink
          to="/dashboard/live-orders"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <ChefHat className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Live Kitchen Board</span>}
        </NavLink>

        <NavLink
          to="/dashboard/menu"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <UtensilsCrossed className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Menu & Dishes</span>}
        </NavLink>

        <NavLink
          to="/dashboard/dining"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Table Reservations</span>}
        </NavLink>

        <NavLink
          to="/dashboard/events"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <Ticket className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Events & Gate Passes</span>}
        </NavLink>

        <NavLink
          to="/my-orders"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Order Receipts</span>}
        </NavLink>
      </nav>

      <div className="sidebar-bottom-section">
        <Link to="/" className="sidebar-nav-item switch-store-link">
          <Store className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Customer Store</span>}
        </Link>

        <button
          type="button"
          onClick={() => {
            handleLogout();
            navigate('/');
          }}
          className="sidebar-nav-item logout-btn"
        >
          <LogOut className="sidebar-icon" size={20} />
          {!isCollapsed && <span className="sidebar-label">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;