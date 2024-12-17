import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Explore our diverse menu, crafted to delight every palate.
          Featuring a delectable array of dishes, our offerings are thoughtfully prepared with the
          finest ingredients to ensure a memorable dining experience.
          we invite you to choose your favorites and savor the flavors. Let your taste buds lead the way and enjoy every bite!</p>
        <div className="search-bar">
          <input type="text" placeholder="Search for dishes or cuisines..." />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
