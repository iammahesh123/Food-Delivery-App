import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Bell } from 'lucide-react';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);
    const { cartItems, token, setToken, handleLogout } = useContext(StoreContext);
    const [scrolling, setScrolling] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const cartItemCount = Object.values(cartItems).reduce((total, count) => total + count, 0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            setScrolling(true);
        } else {
            setScrolling(false);
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`navbar ${scrolling ? 'navbar-hidden' : 'navbar-visible'}`}>
            <Link to="/">
                <img src={assets.logo2} alt="Logo" className="logo" />
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
                <Link to="/collections" onClick={() => setMenu('collections')} className={menu === 'collections' ? 'active' : ''}>
                    Collections
                </Link>
                <Link to="/contact-us" onClick={() => setMenu('contact us')} className={menu === 'contact us' ? 'active' : ''}>
                    Contact Us
                </Link>
            </ul>

            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <Link to="/cart">
                        <img src={assets.basket_icon} alt="Cart" />
                    </Link>
                    {cartItemCount > 0 && <div className="cart-count">{cartItemCount}</div>}
                </div>

                {/* Notification Icon with Lucide */}
                <div className="navbar-notification-icon">
                    <Bell size={30} /> {/* Lucide Bell icon */}
                    <div className="notification-count">3</div> {/* Replace with dynamic count if needed */}
                </div>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign In</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="Profile" />
                        <ul className="nav-profile-dropdown">
                            <li>
                                <img src={assets.bag_icon} alt="Orders" />
                                <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={handleLogout}>
                                <img src={assets.logout_icon} alt="Logout" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;