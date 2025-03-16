import React, { useState } from 'react';
import '../RestrauntPages/RestaurantOverview.css';
import { FaUtensils, FaMoneyBillWave, FaStar, FaHome, FaCarSide, FaUmbrellaBeach, FaHeart, FaCalendarCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RestaurantOverview = ({ restaurant }) => {
  const [activeMenu, setActiveMenu] = useState(null); // State to track active menu

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu); // Toggle menu visibility
  };

  return (
    <div className="overview">
      {/* Offers Section */}
      <div className="section">
        <h2><FaMoneyBillWave /> Offers</h2>
        <ul className="offers-list">
          {restaurant.offers.map((offer, index) => (
            <li key={index}>
              <img src="https://plus.unsplash.com/premium_photo-1728545563898-602569b9ca67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Offer" className="offer-image" />
              <span>{offer}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Menus Section */}
      <div className="section">
        <h2><FaUtensils /> Menus</h2>
        <div className="menus-list">
          {restaurant.menus.map((menu, index) => (
            <div key={index} className="menu-item">
              <div className="menu-header" onClick={() => toggleMenu(menu)}>
                <span>{menu}</span>
                {activeMenu === menu ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {activeMenu === menu && (
                <ul className="menu-items-dropdown">
                  {restaurant.menuItems[menu].map((item, idx) => (
                    <li key={idx}>
                      <img src="https://images.unsplash.com/photo-1449785227466-10687c63e194?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Menu Item" className="menu-item-image" />
                      <span>{item.name}</span>
                      <span className="menu-item-price">${item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Average Cost & Famous Foods Section */}
      <div className="section">
        <h2><FaStar /> Average Cost & Famous Foods</h2>
        <p>Average Cost: {restaurant.averageCost}</p>
        <ul className="famous-foods-list">
          {restaurant.famousFoods.map((food, index) => (
            <li key={index}>
              <img src="https://images.unsplash.com/photo-1449785227466-10687c63e194?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Famous Food" className="food-image" />
              <span>{food}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* More Info Section */}
      <div className="section">
        <h2>More Info</h2>
        <div className="info-cards">
          <div className="info-card">
            <FaHome className="info-icon" />
            <span>Breakfast</span>
          </div>
          <div className="info-card">
            <FaCarSide className="info-icon" />
            <span>Home Delivery</span>
          </div>
          <div className="info-card">
            <FaCarSide className="info-icon" />
            <span>Takeaway Available</span>
          </div>
          <div className="info-card">
            <FaUmbrellaBeach className="info-icon" />
            <span>Outdoor Seating</span>
          </div>
          <div className="info-card">
            <FaHome className="info-icon" />
            <span>Indoor Seating</span>
          </div>
          <div className="info-card">
            <FaHeart className="info-icon" />
            <span>Romantic Dining</span>
          </div>
          <div className="info-card">
            <FaCalendarCheck className="info-icon" />
            <span>Table Booking Recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverview;