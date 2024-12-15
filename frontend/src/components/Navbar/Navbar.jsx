import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [menuOpen,setMenuOpen] = useState();
  const { cartItems, token, setToken } = useContext(StoreContext);



  // Calculate the total number of items in the cart
  const cartItemCount = Object.values(cartItems).reduce((total, count) => total + count, 0);

  return (

    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <ul className={`navbar-menu ${menuOpen ? 'mobile-visible' : ''}`}>
        <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
          Home
        </Link>
        <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>
          Menu
        </a>
        <a href="#app-download" onClick={() => setMenu('mobile app')} className={menu === 'mobile app' ? 'active' : ''}>
          MobileApp
        </a>
        <a href="#contactus" onClick={() => setMenu('contact us')} className={menu === 'contact us' ? 'active' : ''}>
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {/* <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <img src={assets.hamburger} alt="Menu" />
        </div> */}
        
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
        {!token ? <button onClick={() => setShowLogin(true)}>Sign In</button> : <div className='navbar-profile'>
         
          <img src={assets.profile_icon} alt="" />
          <ul className="nav-profile-dropdown">
            <li><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
            <hr/>
            
           <li><img src={assets.logout_icon} alt="" /><p>Logout</p> </li>
          </ul>

        </div>}


      </div>
    </div>
  );
};

export default Navbar;
