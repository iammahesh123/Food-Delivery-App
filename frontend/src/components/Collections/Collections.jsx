import React from 'react';
import './Collection.css';
import { assets, restraunts_list } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, MapPin } from 'lucide-react';

const Collections = () => {
  return (
    <div className="collections-section">
      <div className="collections-header-row">
        <div>
          <div className="collections-eyebrow">
            <Compass size={15} className="text-orange" />
            <span>Curated City Guides</span>
          </div>
          <h2 className="collections-title">Trending Collections</h2>
          <p className="collections-sub">
            Explore handpicked spots for celebrations, romantic dining, and weekend nightlife.
          </p>
        </div>
        <Link to="/collections" className="collections-view-all-btn">
          <span>All Collections</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="collections-grid">
        {restraunts_list.slice(0, 4).map((item) => (
          <Link
            to="/collections"
            className="collections-card"
            key={item._id}
          >
            <img src={item.image} alt={item.name} className="card-image" />
            <div className="card-gradient-overlay" />
            <div className="card-overlay-content">
              <div className="card-place-pill">
                <MapPin size={12} />
                <span>{item.places}</span>
              </div>
              <h3 className="collections-card-title">{item.name}</h3>
              <div className="card-explore-row">
                <span>Explore spots</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
