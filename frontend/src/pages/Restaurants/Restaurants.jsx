import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { Search, Star, Clock, MapPin, Tag, Utensils } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import './Restaurants.css';

const Restaurants = () => {
  const { restaurants_data } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('ALL'); // 'ALL' | 'TOP_RATED' | 'OFFERS' | 'FAST'

  const filteredRestaurants = restaurants_data.filter((r) => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchAddr = r.address?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchAddr) return false;
    }

    // Filter Chips
    if (filterTag === 'TOP_RATED' && Number(r.rating) < 4.2) return false;
    if (filterTag === 'FAST' && Number(r.price) > 15) return false;

    return true;
  });

  return (
    <div className="restaurants-page fade-in">
      <div className="restaurants-page-header">
        <div className="header-info">
          <h1 className="page-title">Verified Dining & Delivery Partners</h1>
          <p className="page-subtitle">
            Browse top-rated kitchen brands, authentic regional flavors, and local favorites.
          </p>
        </div>

        <div className="restaurants-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants, cuisines, or locations..."
              className="search-input"
              aria-label="Search restaurants"
            />
          </div>

          <div className="filter-chips">
            <button
              type="button"
              className={`chip-btn ${filterTag === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterTag('ALL')}
            >
              All Venues
            </button>
            <button
              type="button"
              className={`chip-btn ${filterTag === 'TOP_RATED' ? 'active' : ''}`}
              onClick={() => setFilterTag('TOP_RATED')}
            >
              ★ Top Rated (4.2+)
            </button>
            <button
              type="button"
              className={`chip-btn ${filterTag === 'FAST' ? 'active' : ''}`}
              onClick={() => setFilterTag('FAST')}
            >
              ⚡ Budget Friendly
            </button>
          </div>
        </div>
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.map((res) => (
          <Link to={`/restaurant/${res.id}`} key={res.id} className="restaurant-card">
            <div className="card-image-wrap">
              <img src={res.image} alt={res.name} className="card-cover-img" />
              <div className="card-badge-overlay">
                <span className="rating-pill">
                  <Star size={12} fill="currentColor" /> {res.rating}
                </span>
              </div>
            </div>

            <div className="card-details">
              <div className="details-header">
                <h3 className="res-title">{res.name}</h3>
                <span className="res-prep-time">25–35 min</span>
              </div>

              <p className="res-cuisine">{res.description || 'Artisanal culinary specialties'}</p>

              <div className="details-footer">
                <div className="res-location">
                  <MapPin size={14} className="pin-icon" />
                  <span>{res.address}</span>
                </div>
                <span className="res-avg-cost">${res.price || '25'} for two</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;