import React from 'react';
import { Link } from 'react-router-dom';
import { menu_list } from '../../assets/assets';
import { UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-header-row">
        <div>
          <div className="explore-menu-tag">
            <Sparkles size={15} className="text-orange" />
            <span>Curated Cuisines</span>
          </div>
          <h2 className="explore-menu-title">What are you craving today?</h2>
          <p className="explore-menu-sub">
            Browse our hand-crafted menu categories. Select any cuisine to filter the delicious dishes below.
          </p>
        </div>
        <Link to="/explore-menu" className="explore-view-full-btn">
          <span>Full Menu & Filters</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="explore-categories-rail">
        {/* 'All' Option Card */}
        <button
          type="button"
          onClick={() => setCategory('All')}
          className={`category-rail-card ${category === 'All' ? 'active' : ''}`}
          aria-label="Show All Cuisines"
        >
          <div className="category-avatar-wrapper all-avatar">
            <UtensilsCrossed size={28} className="all-icon" />
          </div>
          <span className="category-card-name">All Cuisines</span>
          <span className="category-count-badge">32 Dishes</span>
        </button>

        {/* Dynamic Category Cards */}
        {menu_list.map((item, index) => {
          const isActive = category === item.menu_name;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)}
              className={`category-rail-card ${isActive ? 'active' : ''}`}
              aria-label={`Filter by ${item.menu_name}`}
            >
              <div className="category-avatar-wrapper">
                <img
                  src={item.menu_image}
                  alt={item.menu_name}
                  className="category-avatar-img"
                />
              </div>
              <span className="category-card-name">{item.menu_name}</span>
              <span className="category-count-badge">4 Curated</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMenu;
