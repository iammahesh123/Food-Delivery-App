import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShoppingBag,
  CalendarCheck,
  Ticket,
  BadgePercent,
  Activity,
  Store,
  ChefHat,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { StoreContext } from '../../../context/StoreContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { userRole, handleLogout } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/admin', label: 'Overview & KPIs', icon: LayoutDashboard, end: true },
    { to: '/admin/restaurants', label: 'Restaurants & Merchants', icon: Building2, badge: '28' },
    { to: '/admin/users', label: 'Users & Identities', icon: Users, badge: '1.4k' },
    { to: '/admin/orders', label: 'Global Orders & Fleet', icon: ShoppingBag, badge: 'Live' },
    { to: '/admin/dining', label: 'Dining Reservations', icon: CalendarCheck },
    { to: '/admin/events', label: 'Live Events & Passes', icon: Ticket },
    { to: '/admin/promos', label: 'Financials & Promos', icon: BadgePercent },
    { to: '/admin/settings', label: 'System Health & Config', icon: Activity },
  ];

  return (
    <div className="platform-admin-shell">
      {/* Top Header Command Bar */}
      <header className="admin-command-bar">
        <div className="command-bar-left">
          <button
            type="button"
            className="mobile-admin-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="admin-brand-tag">
            <div className="brand-logo-mark">
              <span>🍅</span>
            </div>
            <div className="brand-titles">
              <span className="platform-name">TOMATO</span>
              <span className="platform-console-badge">PLATFORM ADMIN</span>
            </div>
          </div>

          <div className="system-live-pill">
            <span className="live-pulse-dot"></span>
            <span className="live-status-text">SYSTEM OPERATIONAL</span>
          </div>
        </div>

        <div className="command-bar-center">
          <div className="admin-global-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Quick search orders, merchants, users, reservations..."
              aria-label="Admin global search"
            />
            <kbd className="search-shortcut">⌘K</kbd>
          </div>
        </div>

        <div className="command-bar-right">
          {/* Quick Hub Switchers */}
          <Link to="/dashboard" className="hub-switch-btn" title="Go to Merchant Operations Console">
            <ChefHat size={16} />
            <span>Merchant Hub</span>
          </Link>

          <Link to="/" className="hub-switch-btn outline" title="Open Customer Web Store">
            <Store size={16} />
            <span>Customer Store</span>
          </Link>

          <div className="admin-profile-pill">
            <div className="admin-avatar">MK</div>
            <div className="admin-details">
              <span className="admin-name">Mahesh Kumar</span>
              <span className="admin-role">Super Admin</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => {
              handleLogout();
              navigate('/');
            }}
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Stage: Sidebar + Body */}
      <div className="admin-main-stage">
        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div
            className="admin-mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${
            isMobileMenuOpen ? 'mobile-open' : ''
          }`}
        >
          <div className="sidebar-section-label">
            {!isSidebarCollapsed && <span>MAIN PLATFORM</span>}
          </div>

          <nav className="admin-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={19} className="nav-icon" />
                  {!isSidebarCollapsed && (
                    <span className="nav-title">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`nav-badge ${
                        item.badge === 'Live' ? 'badge-live' : ''
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="sidebar-collapse-trigger">
            <button
              type="button"
              className="collapse-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="admin-content-viewport">
          <div className="admin-content-scroller">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
