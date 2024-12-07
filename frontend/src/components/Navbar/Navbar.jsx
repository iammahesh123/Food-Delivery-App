import React, { useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'

const Navbar = () => {
    const [menu, setMenu] = useState("home")
    const toggleMenu = () => {
        document.querySelector('.navbar-menu').classList.toggle('active');
    };
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="navbar-menu">
            <li onClick={() => setMenu("home")} className={menu == "home" ? "active":""}>Home</li>
            <li onClick={() => setMenu("menu")} className={menu == "menu" ? "active":""}>Menu</li>
            <li onClick={() => setMenu("mobile app")} className={menu == "mobile app" ? "active":""}>Mobile APP</li>
            <li onClick={() => setMenu("contact us")} className={menu == "contact us" ? "active":""}>Contact Us</li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <img src={assets.basket_icon} alt="" />
                <div className="dot"></div>
            </div>
            <button>Sign In</button>
        </div>
        <div className="menu-toggle" onClick={toggleMenu}>
                ☰ {/* Hamburger icon for menu toggle */}
            </div>
    </div>
  )
}

export default Navbar
