import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Search, ArrowRight, Sparkles, Clock, Star, Flame, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import heroFeastImg from '../../assets/hero_feast.jpg';
import './Header.css';

const QUICK_TAGS = [
  { name: 'All', icon: '✨' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Rolls', icon: '🌯' },
  { name: 'Salad', icon: '🥗' },
  { name: 'Deserts', icon: '🍰' },
  { name: 'Sandwich', icon: '🥪' },
  { name: 'Cake', icon: '🎂' },
  { name: 'Pasta', icon: '🍝' },
  { name: 'Noodles', icon: '🍜' },
];

const Header = ({ onSelectCategory }) => {
  const [query, setQuery] = useState('');
  const [activeQuickTag, setActiveQuickTag] = useState('All');
  const navigate = useNavigate();
  const { food_list } = useContext(StoreContext);
  const dropdownRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore-menu?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/explore-menu');
    }
  };

  const handleTagClick = (tagName) => {
    setActiveQuickTag(tagName);
    if (onSelectCategory) {
      onSelectCategory(tagName);
      const menuSection = document.getElementById('explore-menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/explore-menu?category=${encodeURIComponent(tagName)}`);
    }
  };

  // Autocomplete matching dishes
  const suggestions = query.trim()
    ? food_list
        .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
    : [];

  return (
    <section className="hero-section" aria-label="Hero Introduction">
      {/* Background Decorative Mesh Glows */}
      <div className="hero-glow hero-glow-1" aria-hidden="true" />
      <div className="hero-glow hero-glow-2" aria-hidden="true" />

      <div className="hero-container">
        {/* Left Column: Value Prop, Heading, Search, Trust */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="badge-pulse"></span>
            <Flame size={14} className="badge-flame-icon" />
            <span className="badge-text">50% OFF First Order • Code: <strong>WELCOME50</strong></span>
          </div>

          <h1 className="hero-main-title">
            Delicious food <br />
            <span className="hero-title-gradient">delivered hot & fast</span> <br />
            to your doorstep.
          </h1>

          <p className="hero-subtitle">
            Explore 500+ top-rated local eateries, five-star chef specials, and gourmet comfort food.
            Track your delivery in real-time with temperature-controlled packaging.
          </p>

          {/* Search Box with Autocomplete */}
          <form onSubmit={handleSearchSubmit} className="hero-search-wrapper" ref={dropdownRef}>
            <div className="hero-search-input-group">
              <Search className="hero-search-icon" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, restaurants, or cuisines..."
                className="hero-search-field"
                aria-label="Search food or restaurants"
              />
              <button type="submit" className="hero-search-btn" aria-label="Find Food">
                <span>Find Food</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Live Autocomplete Dropdown */}
            {suggestions.length > 0 && (
              <div className="hero-autocomplete-dropdown">
                <div className="autocomplete-header">Matching dishes & cuisines</div>
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="hero-autocomplete-item"
                    onClick={() => navigate(`/explore-menu?search=${encodeURIComponent(item.name)}`)}
                  >
                    <img src={item.image} alt={item.name} className="autocomplete-thumb" />
                    <div className="autocomplete-details">
                      <span className="autocomplete-name">{item.name}</span>
                      <span className="autocomplete-meta">{item.category} • ${item.price}</span>
                    </div>
                    <span className="autocomplete-tag">View Dish</span>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Quick Cuisine Tags */}
          <div className="hero-quick-tags-container">
            <span className="quick-tags-label">Popular:</span>
            <div className="hero-quick-tags-list">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => handleTagClick(tag.name)}
                  className={`quick-tag-chip ${activeQuickTag === tag.name ? 'active' : ''}`}
                >
                  <span className="quick-tag-icon">{tag.icon}</span>
                  <span className="quick-tag-name">{tag.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Value Metrics */}
          <div className="hero-metrics-strip">
            <div className="metric-item">
              <div className="metric-icon-wrap bg-amber">
                <Star size={16} className="text-amber" />
              </div>
              <div className="metric-text">
                <span className="metric-value">4.9 / 5</span>
                <span className="metric-label">15,000+ Reviews</span>
              </div>
            </div>

            <div className="metric-divider" />

            <div className="metric-item">
              <div className="metric-icon-wrap bg-emerald">
                <Clock size={16} className="text-emerald" />
              </div>
              <div className="metric-text">
                <span className="metric-value">20-30 min</span>
                <span className="metric-label">Avg Fast Delivery</span>
              </div>
            </div>

            <div className="metric-divider" />

            <div className="metric-item">
              <div className="metric-icon-wrap bg-rose">
                <ShieldCheck size={16} className="text-rose" />
              </div>
              <div className="metric-text">
                <span className="metric-value">100% Fresh</span>
                <span className="metric-label">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Showcase with Interactive Floating Badges */}
        <div className="hero-visual">
          <div className="hero-visual-card-wrapper">
            <div className="hero-image-frame">
              <img
                src={heroFeastImg}
                alt="Gourmet Food Feast with Pizza, Poke Bowl, and Burger"
                className="hero-main-photo"
              />
              <div className="hero-photo-overlay" />
            </div>

            {/* Floating Glass Badge 1: Ultra Fast Delivery */}
            <div className="hero-floating-badge badge-top-right">
              <div className="badge-icon-circle bg-orange">
                <Zap size={18} className="text-orange" />
              </div>
              <div className="floating-badge-content">
                <span className="floating-badge-title">Express Delivery</span>
                <span className="floating-badge-sub">⚡ Arriving in 24 mins</span>
              </div>
            </div>

            {/* Floating Glass Badge 2: Chef's Special Bowl Rating */}
            <div className="hero-floating-badge badge-bottom-left">
              <div className="badge-icon-circle bg-green">
                <Star size={18} className="text-green" />
              </div>
              <div className="floating-badge-content">
                <div className="badge-stars-row">
                  <span className="star-rating-score">4.9</span>
                  <span className="star-rating-count">(2,840+ foodies)</span>
                </div>
                <span className="floating-badge-sub">Chef's Artisan Specials</span>
              </div>
            </div>

            {/* Floating Glass Badge 3: Discount voucher applied */}
            <div className="hero-floating-badge badge-bottom-right">
              <div className="badge-icon-circle bg-rose">
                <CheckCircle2 size={18} className="text-rose" />
              </div>
              <div className="floating-badge-content">
                <span className="floating-badge-title">Voucher Applied</span>
                <span className="floating-badge-sub">Saved $12.50 with WELCOME50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;