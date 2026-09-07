import React, { useState } from 'react';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import './MenuPage.css';

const MenuPage = () => {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All' | 'Veg' | 'Non-Veg'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-low' | 'price-high' | 'name'

  return (
    <div className="menu-page fade-in">
      <div className="menu-page-header">
        <div className="header-text">
          <h1 className="menu-page-title">Explore Our Full Culinary Catalog</h1>
          <p className="menu-page-subtitle">
            Discover artisanal dishes prepared fresh by verified chefs across top restaurants.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="menu-controls-bar">
          <div className="menu-search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name or ingredient..."
              className="menu-search-input"
              aria-label="Search dishes"
            />
          </div>

          <div className="menu-filters-group">
            {/* Dietary Toggle */}
            <div className="dietary-segmented-control" role="group" aria-label="Dietary filter">
              <button
                type="button"
                className={`dietary-btn ${dietaryFilter === 'All' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('All')}
              >
                All
              </button>
              <button
                type="button"
                className={`dietary-btn ${dietaryFilter === 'Veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('Veg')}
              >
                🌱 Veg Only
              </button>
              <button
                type="button"
                className={`dietary-btn ${dietaryFilter === 'Non-Veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('Non-Veg')}
              >
                🍗 Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort dishes"
              >
                <option value="default">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Icon Scroller */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Filtered Dishes Grid */}
      <FoodDisplay
        category={category}
        searchQuery={searchQuery}
        dietaryFilter={dietaryFilter}
        sortBy={sortBy}
      />
    </div>
  );
};

export default MenuPage;
