import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [menuOpen, setMenuOpen] = useState();
  const { cartItems, token, setToken } = useContext(StoreContext);
  const [scrolling, setScrolling] = useState(false); // State to track scroll
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position

  // Calculate the total number of items in the cart
  const cartItemCount = Object.values(cartItems).reduce((total, count) => total + count, 0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Hide navbar when scrolling down, and show it when scrolling up
    if (currentScrollY > lastScrollY) {
      setScrolling(true); // Scroll down -> hide navbar
    } else {
      setScrolling(false); // Scroll up -> show navbar
    }

    // Update the last scroll position
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up on unmount
  }, [lastScrollY]); // Only re-run effect if lastScrollY changes

  return (
    <div className={`navbar ${scrolling ? 'navbar-hidden' : 'navbar-visible'}`}>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <ul className={`navbar-menu ${menuOpen ? 'mobile-visible' : ''}`}>
        <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
          Menu
        </Link>
        <Link to="/restaurants" onClick={() => setMenu('restaurants')} className={menu === 'restaurants' ? 'active' : ''}>
          Restaurants
        </Link>
        <Link to="/collections" onClick={() => setMenu('collections')} className={menu === 'mobile app' ? 'active' : ''}>
          Collections
        </Link>
        <Link to="/contact-us" onClick={() => setMenu('contact us')} className={menu === 'contact us' ? 'active' : ''}>
          Contact Us
        </Link>
      </ul>
      <div className="navbar-right">
        {/* <div className="navbar-hamburger" onClick={() => 
          setMenuOpen(!menuOpen)}><img src={assets.hamburger} 
          alt="Menu" /></div> */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {cartItemCount > 0 && (
            <div className="cart-count">
              {cartItemCount}
            </div>
          )}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
