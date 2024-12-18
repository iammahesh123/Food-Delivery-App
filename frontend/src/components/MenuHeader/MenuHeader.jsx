import React from 'react'
import './MenuHeader.css'

const MenuHeader = () => {
    return (
        <div className="container">
        <div>
          <h2>Your Heading Here</h2>
          <p>Your paragraph text goes here.</p>
          <div className="dropdown-container">
            {/* Dropdown Menu */}
            <select>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <div className="search-container">
            {/* Search Bar */}
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    );

}

export default MenuHeader
