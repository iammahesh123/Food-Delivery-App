import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { Sparkles, Filter, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FoodDisplay = ({ category = 'All', searchQuery = '' }) => {
  const { food_list } = useContext(StoreContext);
  const [dietary, setDietary] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  if (!food_list || food_list.length === 0) {
    return (
      <div className="food-display empty-display">
        <p>No dishes available at the moment.</p>
      </div>
    );
  }

  // Filter Pipeline
  let filtered = food_list.filter((item) => {
    // Category Filter
    if (category && category !== 'All' && item.category !== category) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    // Dietary Filter
    if (dietary === 'Veg') {
      const lower = item.name.toLowerCase();
      if (lower.includes('chicken') || lower.includes('salmon') || lower.includes('steak') || lower.includes('meat')) {
        return false;
      }
    } else if (dietary === 'Non-Veg') {
      const lower = item.name.toLowerCase();
      if (!lower.includes('chicken') && !lower.includes('salmon') && !lower.includes('steak') && !lower.includes('meat')) {
        return false;
      }
    }
    return true;
  });

  // Sorting Pipeline
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Additional recommended dishes if current filtered count is low (e.g. 4 items in a category)
  const recommendedDishes = category !== 'All' && filtered.length < 8
    ? food_list.filter((item) => item.category !== category).slice(0, 4)
    : [];

  return (
    <div className="food-display-container" id="food-display">
      {/* Header & Controls Bar */}
      <div className="food-display-toolbar">
        <div className="toolbar-left">
          <div className="food-display-badge">
            <Sparkles size={14} className="text-orange" />
            <span>{category === 'All' ? 'Full Catalog' : `${category} Specialties`}</span>
          </div>
          <h2 className="food-display-title">
            {category === 'All' ? 'Top Dishes Curated For You' : `Best ${category} Dishes`}
          </h2>
          <p className="food-display-sub">
            Freshly prepared with authentic ingredients and delivered piping hot.
          </p>
        </div>

        <div className="toolbar-controls">
          {/* Dietary Filter Buttons */}
          <div className="dietary-pills-group">
            <button
              type="button"
              onClick={() => setDietary('All')}
              className={`dietary-pill ${dietary === 'All' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setDietary('Veg')}
              className={`dietary-pill ${dietary === 'Veg' ? 'active' : ''}`}
            >
              🌱 Veg Only
            </button>
            <button
              type="button"
              onClick={() => setDietary('Non-Veg')}
              className={`dietary-pill ${dietary === 'Non-Veg' ? 'active' : ''}`}
            >
              🍗 Non-Veg
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrap">
            <ArrowUpDown size={14} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="food-sort-select"
              aria-label="Sort dishes"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Strip */}
      <div className="food-display-status-bar">
        <span className="count-pill">Showing <strong>{filtered.length}</strong> delicious dishes</span>
        {category !== 'All' && (
          <span className="active-filter-indicator">
            Active category: <strong>{category}</strong>
          </span>
        )}
      </div>

      {/* Main Dishes Grid */}
      {filtered.length > 0 ? (
        <div className="food-display-grid">
          {filtered.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className="food-empty-state">
          <h3>No dishes match your active filter</h3>
          <p>Try switching to 'All' dietary preference or clear the search filters.</p>
          <button
            type="button"
            onClick={() => { setDietary('All'); }}
            className="clear-filters-btn"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Recommended Additions Rail if Filtered category has fewer dishes */}
      {recommendedDishes.length > 0 && (
        <div className="recommended-strip-section">
          <div className="recommended-strip-header">
            <h3>Popular pairings from other kitchens</h3>
            <Link to="/explore-menu" className="browse-all-link">
              <span>View full menu</span>
              <ChevronRight size={15} />
            </Link>
          </div>
          <div className="food-display-grid">
            {recommendedDishes.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
