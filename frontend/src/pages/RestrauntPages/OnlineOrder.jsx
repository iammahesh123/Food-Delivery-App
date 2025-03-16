import React, { useState } from 'react';
import './OnlineOrder.css';

const OnlineOrder = ({ restaurant }) => {
  const [selectedMenu, setSelectedMenu] = useState(restaurant.menus[0]); // Default to the first menu

  return (
    <div className="online-order">
      {/* Left Side: Vertical Navbar */}
      <div className="menu-navbar">
        <ul>
          {restaurant.menus.map((menu, index) => (
            <li
              key={index}
              className={selectedMenu === menu ? 'active' : ''}
              onClick={() => setSelectedMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side: Menu Items */}
      <div className="menu-items">
        {restaurant.menuItems[selectedMenu].map((item, index) => (
          <div key={index} className="item-card">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-rating">
                <span>⭐ {item.rating}</span>
              </div>
              <p className="item-cost">${item.price}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineOrder;