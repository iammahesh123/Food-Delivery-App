import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { ShoppingBag, Bell, User, LayoutDashboard, LogOut, Menu as MenuIcon, X, UtensilsCrossed, CalendarCheck, Ticket } from 'lucide-react';

const Navbar = ({ setShowLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems, token, handleLogout, userRole, switchRole, userProfile } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartItemCount = Object.values(cartItems).reduce((total, count) => total + count, 0);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo-link">
          <img src={assets.logo2} alt="Tomato Logo" className="navbar-logo" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/explore-menu"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Menu
          </NavLink>
          <NavLink
            to="/dining"
            className={({ isActive }) => `nav-item dining-link ${isActive ? 'active' : ''}`}
          >
            Dining <span className="nav-hot-chip">Hot</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `nav-item events-link ${isActive ? 'active' : ''}`}
          >
            Events <span className="nav-live-chip">Live</span>
          </NavLink>
          <NavLink
            to="/restaurants"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Collections
          </NavLink>
          <NavLink
            to="/featureservices"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Services
          </NavLink>
          <NavLink
            to="/contact-us"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Section Actions */}
        <div className="navbar-actions">
          {/* Operations Hub Quick-Switch / Link */}
          <Link to="/dashboard" className="portal-switch-pill" title="Merchant & Operations Console">
            <LayoutDashboard size={16} />
            <span className="portal-label">Merchant Hub</span>
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="action-icon-btn cart-btn" aria-label={`View Cart with ${cartItemCount} items`}>
            <ShoppingBag size={22} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>

          {/* Notifications */}
          <button
            type="button"
            className="action-icon-btn"
            onClick={() => navigate('/my-orders')}
            aria-label="Order notifications"
          >
            <Bell size={22} />
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
                  <User size={18} />
                </div>
                <span className="user-name-label">{userProfile.name.split(' ')[0]}</span>
              </button>

              <div className="profile-dropdown-content">
                <div className="dropdown-user-header">
                  <strong>{userProfile.name}</strong>
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
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer fade-in">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/explore-menu"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Menu Catalog
          </NavLink>
          <NavLink
            to="/dining"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Dining Out & Table Booking ✨
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Live Events & Concerts 🎟️
          </NavLink>
          <NavLink
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Restaurants Directory
          </NavLink>
          <NavLink
            to="/collections"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Gourmet Collections
          </NavLink>
          <NavLink
            to="/featureservices"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Featured Services
          </NavLink>
          <NavLink
            to="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            My Orders
          </NavLink>
          <NavLink
            to="/my-dining"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            My Dining Passes
          </NavLink>
          <NavLink
            to="/my-tickets"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            My Event Tickets
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Merchant Operations Portal
          </NavLink>
          <NavLink
            to="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-nav-item"
          >
            Contact & Support
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;