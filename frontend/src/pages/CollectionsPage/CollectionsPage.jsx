import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { Star, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CollectionsPage.css';

const CollectionsPage = () => {
  const { restraunts_list, restaurants_data } = useContext(StoreContext);

  const banner = {
    title: 'Curated Gourmet Collections',
    subtitle: 'Discover Hyderabad & New York’s Trending Tables',
    description:
      'From authentic regional flavors and rooftop dining to late-night bites and romantic dates, explore handpicked lists curated by local food critics.',
    image: assets.christmas_img,
  };

  return (
    <div className="collections-page-wrapper fade-in">
      {/* Banner */}
      <div className="collections-banner-card">
        <div className="banner-content">
          <div className="banner-tag">
            <Sparkles size={16} />
            <span>Curated Guides</span>
          </div>
          <h1 className="banner-title">{banner.title}</h1>
          <h2 className="banner-subtitle">{banner.subtitle}</h2>
          <p className="banner-description">{banner.description}</p>
        </div>
      </div>

      {/* Featured Collections Gallery */}
      <div className="collections-section">
        <h2 className="section-heading">Trending Thematic Collections</h2>
        <div className="thematic-grid">
          {restraunts_list.map((c) => (
            <div key={c._id} className="thematic-card">
              <img src={c.image} alt={c.name} className="thematic-img" />
              <div className="thematic-overlay">
                <h3 className="thematic-name">{c.name}</h3>
                <span className="thematic-places">{c.places}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Restaurants in This Collection */}
      <div className="collection-restaurants-section">
        <div className="section-head-bar">
          <h2>Featured Dining Venues</h2>
          <Link to="/restaurants" className="see-all-link">
            See all venues <ArrowRight size={14} />
          </Link>
        </div>

        <div className="featured-restaurants-grid">
          {restaurants_data.map((res) => (
            <Link to={`/restaurant/${res.id}`} key={res.id} className="featured-res-card">
              <img src={res.image} alt={res.name} className="featured-res-img" />
              <div className="featured-res-meta">
                <div className="top-line">
                  <h4 className="res-name">{res.name}</h4>
                  <span className="rating-tag">
                    <Star size={12} fill="currentColor" /> {res.rating}
                  </span>
                </div>
                <p className="res-addr">
                  <MapPin size={12} /> {res.address}
                </p>
                <span className="res-spec">{res.description}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
