import React from 'react';
import './MenuHeader.css';
import { FaSearch, FaBars } from 'react-icons/fa'; // Importing Font Awesome icons

const MenuHeader = () => {
  return (
    <div className="header-container">
      <div className='header-subcontainer'>
        <h2>Foodguru</h2>
        <p>Discover the best food & drinks</p>
        <div className="search-dropdown-wrapper">
          {/* Dropdown Menu */}
          <div className="header-dropdown-container">
            <FaBars className="icon" />
            <select>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          {/* Search Bar */}
          <div className="search-container">
            <FaSearch className="icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuHeader;