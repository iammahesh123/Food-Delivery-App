import React, { useContext, useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { ShoppingBag, Bell, User, LayoutDashboard, LogOut, Menu as MenuIcon, X, UtensilsCrossed, CalendarCheck, Ticket, ShieldCheck, ChevronDown, SlidersHorizontal, Sparkles } from 'lucide-react';

const Navbar = ({ setShowLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsOpen, setPortalsOpen] = useState(false);
  const portalsRef = useRef(null);
  const { cartItems, token, handleLogout, userRole, switchRole, userProfile } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartItemCount = Object.values(cartItems).reduce((total, count) => total + count, 0);

  // Close portals dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (portalsRef.current && !portalsRef.current.contains(event.target)) {
        setPortalsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo-link" aria-label="Go to Homepage">
          <img src={assets.logo} alt="Tomato" className="navbar-logo" />
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/explore-menu"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>Menu</span>
          </NavLink>

          <NavLink
            to="/dining"
            className={({ isActive }) => `nav-item dining-link ${isActive ? 'active' : ''}`}
          >
            <span>Dining</span>
            <span className="nav-hot-chip">Hot</span>
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) => `nav-item events-link ${isActive ? 'active' : ''}`}
          >
            <span>Events</span>
            <span className="nav-live-chip">
              <span className="nav-live-dot" />
              Live
            </span>
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>Restaurants</span>
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>Collections</span>
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>Contact</span>
          </NavLink>
        </nav>

        {/* Right Section Actions & Consoles */}
        <div className="navbar-actions">
          {/* Consolidated Business Portals Switcher */}
          <div className="portals-menu-wrapper" ref={portalsRef}>
            <button
              type="button"
              className={`portals-trigger-btn ${portalsOpen ? 'active' : ''}`}
              onClick={() => setPortalsOpen(!portalsOpen)}
              aria-expanded={portalsOpen}
              aria-label="Switch Portals"
            >
              <SlidersHorizontal size={14} className="portals-icon" />
              <span className="portals-label">Portals</span>
              <ChevronDown size={13} className={`portals-chevron ${portalsOpen ? 'rotate' : ''}`} />
            </button>

            {portalsOpen && (
              <div className="portals-dropdown-content" role="menu">
                <div className="portals-dropdown-header">Workspaces & Consoles</div>
                <Link
                  to="/admin"
                  className="portal-dropdown-item"
                  onClick={() => setPortalsOpen(false)}
                  role="menuitem"
                >
                  <div className="portal-item-icon admin-icon-bg">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="portal-item-text">
                    <span className="portal-item-title">Platform Super Admin</span>
                    <span className="portal-item-sub">Global KPIs, approvals & fleet</span>
                  </div>
                </Link>

                <Link
                  to="/dashboard"
                  className="portal-dropdown-item"
                  onClick={() => setPortalsOpen(false)}
                  role="menuitem"
                >
                  <div className="portal-item-icon merchant-icon-bg">
                    <LayoutDashboard size={18} />
                  </div>
                  <div className="portal-item-text">
                    <span className="portal-item-title">Merchant Hub Console</span>
                    <span className="portal-item-sub">Live kitchen dispatch & menu</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Shopping Cart Icon with Badge */}
          <Link to="/cart" className="action-icon-btn cart-btn" aria-label={`View Cart with ${cartItemCount} items`}>
            <ShoppingBag size={21} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>

          {/* Notifications Bell */}
          <button
            type="button"
            className="action-icon-btn notification-btn"
            onClick={() => navigate('/my-orders')}
            aria-label="Order notifications"
          >
            <Bell size={21} />
            <span className="notification-dot" />
          </button>

          {/* User Profile / Authentication */}
          {!token ? (
            <button
              type="button"
              className="signin-btn"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div className="user-profile-menu">
              <button
                type="button"
                className="profile-avatar-btn"
                aria-label="Account options"
                onClick={() => navigate('/my-orders')}
              >
                <div className="avatar-circle">
                  <User size={17} />
                </div>
                <span className="user-name-label">{userProfile?.name?.split(' ')[0] || 'Account'}</span>
              </button>

              <div className="profile-dropdown-content">
                <div className="dropdown-user-header">
                  <strong>{userProfile?.name || 'Valued Member'}</strong>
                  <span className="role-tag">Role: {userRole}</span>
                </div>
                <hr className="dropdown-divider" />
                <Link to="/my-orders" className="dropdown-item">
                  <ShoppingBag size={16} />
                  <span>My Orders</span>
                </Link>
                <Link to="/my-dining" className="dropdown-item">
                  <CalendarCheck size={16} />
                  <span>My Dining Passes</span>
                </Link>
                <Link to="/my-tickets" className="dropdown-item">
                  <Ticket size={16} />
                  <span>My Event Tickets</span>
                </Link>
                <Link to="/admin" className="dropdown-item">
                  <ShieldCheck size={16} />
                  <span>Platform Admin</span>
                </Link>
                <Link to="/dashboard" className="dropdown-item">
                  <LayoutDashboard size={16} />
                  <span>Merchant Portal</span>
                </Link>
                <hr className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-drawer-backdrop" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="drawer-logo-link" aria-label="Go to Homepage">
                <img src={assets.logo} alt="Tomato" className="drawer-logo" />
              </Link>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Quick Bar in Mobile Drawer */}
            <div className="drawer-user-section">
              {!token ? (
                <button
                  type="button"
                  className="drawer-signin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogin(true);
                  }}
                >
                  <User size={18} />
                  <span>Sign In / Register</span>
                </button>
              ) : (
                <div className="drawer-logged-user">
                  <div className="drawer-user-info">
                    <div className="avatar-circle">
                      <User size={18} />
                    </div>
                    <div>
                      <strong>{userProfile?.name || 'Valued Gourmet'}</strong>
                      <span className="drawer-role-tag">{userRole}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="drawer-logout-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Navigation Links */}
            <div className="drawer-links-scroll">
              <span className="drawer-section-label">Main Menu</span>
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
                end
              >
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/explore-menu"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Menu Catalog</span>
              </NavLink>
              <NavLink
                to="/dining"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Dining Out & Table Booking</span>
                <span className="nav-hot-chip">Hot</span>
              </NavLink>
              <NavLink
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Live Concerts & Events</span>
                <span className="nav-live-chip">Live</span>
              </NavLink>
              <NavLink
                to="/restaurants"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Partner Restaurants</span>
              </NavLink>
              <NavLink
                to="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Gourmet Collections</span>
              </NavLink>
              <NavLink
                to="/featureservices"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Catering & Services</span>
              </NavLink>

              <span className="drawer-section-label">My Activity</span>
              <NavLink
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Track My Orders</span>
              </NavLink>
              <NavLink
                to="/my-dining"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>My Dining Bookings</span>
              </NavLink>
              <NavLink
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>My Event Passes</span>
              </NavLink>
              <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>View Shopping Cart ({cartItemCount})</span>
              </NavLink>

              <span className="drawer-section-label">Business Portal</span>
              <NavLink
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item portal-nav-item admin-portal-item"
              >
                <ShieldCheck size={16} />
                <span>Platform Super Admin</span>
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item portal-nav-item"
              >
                <LayoutDashboard size={16} />
                <span>Merchant Hub Console</span>
              </NavLink>

              <span className="drawer-section-label">Support</span>
              <NavLink
                to="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-item"
              >
                <span>Contact & 24/7 Concierge</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;