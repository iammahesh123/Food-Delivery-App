import React, { useState, useContext, useMemo } from 'react';
import { StoreContext, DINING_VENUES } from '../../context/StoreContext';
import { assets, restraunts_list as defaultList } from '../../assets/assets';
import { 
  Star, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Search, 
  Flame, 
  UtensilsCrossed, 
  CalendarCheck, 
  Clock, 
  Heart,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CollectionsPage.css';

// Curated Collection Guides Metadata with Rich Themes
const THEMATIC_COLLECTIONS = [
  {
    id: 'rooftop',
    name: 'Rooftop & Sunset Views',
    places: '34 places',
    tag: 'Skyline & Cocktails',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    description: 'Elevated dining with breathtaking skyline vistas and craft mixology.',
    mood: 'Rooftops'
  },
  {
    id: 'romantic',
    name: 'Romantic Candlelight Dates',
    places: '28 places',
    tag: 'Intimate Ambiance',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop',
    description: 'Charming courtyards, soft lighting, and curated wine pairings.',
    mood: 'Romantic'
  },
  {
    id: 'regional',
    name: 'Authentic Regional Flavours',
    places: '52 places',
    tag: 'Heritage Recipes',
    image: assets.regional_flavor_res || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    description: 'Time-honored slow-cooked biryanis, curries, and regional heritage feasts.',
    mood: 'Regional'
  },
  {
    id: 'trending',
    name: 'Top 10 Trending Hotspots',
    places: '45 places',
    tag: 'Foodie Favorites',
    image: assets.trending_res || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    description: 'The city’s most viral culinary sensations and buzz-worthy tables.',
    mood: 'Trending'
  },
  {
    id: 'newly-opened',
    name: 'Newly Opened Eateries',
    places: '26 places',
    tag: 'Fresh On The Scene',
    image: assets.newly_open_res || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800&auto=format&fit=crop',
    description: 'Be the first to experience the latest chef debuts and concept bistros.',
    mood: 'New'
  },
  {
    id: 'celebrations',
    name: 'Grand Celebration Feasts',
    places: '38 places',
    tag: 'Festive Dining',
    image: assets.new_year || assets.christmas_img || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    description: 'Spacious banquet tables, private rooms, and multi-course group menus.',
    mood: 'Festive'
  }
];

const MOOD_FILTERS = [
  'All Collections',
  'Rooftops',
  'Romantic',
  'Regional',
  'Trending',
  'New',
  'Festive'
];

const CollectionsPage = () => {
  const [selectedMood, setSelectedMood] = useState('All Collections');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState('rooftop');
  const { restaurants_data } = useContext(StoreContext);
  const navigate = useNavigate();

  // Combine StoreContext venues with rich dining venues
  const allVenues = useMemo(() => {
    return DINING_VENUES && DINING_VENUES.length > 0 ? DINING_VENUES : [];
  }, []);

  // Filter collections based on mood chip and search
  const filteredCollections = useMemo(() => {
    return THEMATIC_COLLECTIONS.filter((col) => {
      const matchesMood =
        selectedMood === 'All Collections' || col.mood === selectedMood;
      const matchesSearch =
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMood && matchesSearch;
    });
  }, [selectedMood, searchQuery]);

  // Selected collection object
  const currentCollection = useMemo(() => {
    return (
      THEMATIC_COLLECTIONS.find((c) => c.id === activeCollectionId) ||
      THEMATIC_COLLECTIONS[0]
    );
  }, [activeCollectionId]);

  return (
    <div className="collections-page-wrapper fade-in">
      {/* 1. Curated Hero Header */}
      <section className="collections-hero-banner">
        <div className="collections-hero-glow glow-1" aria-hidden="true" />
        <div className="collections-hero-glow glow-2" aria-hidden="true" />

        <div className="collections-hero-container">
          <div className="collections-hero-content">
            <div className="collections-pill-badge">
              <Sparkles size={14} className="sparkle-icon" />
              <span>Curated City Guides • Handpicked by Food Critics</span>
            </div>

            <h1 className="collections-main-title">
              Curated Dining & <br />
              <span className="collections-gradient-text">Gourmet Collections</span>
            </h1>

            <p className="collections-main-subtitle">
              Explore handpicked dining trails, rooftop sunset tables, intimate candlelight dates, and celebrated heritage kitchens across the city.
            </p>

            {/* Quick Search Bar */}
            <div className="collections-search-box">
              <Search size={18} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search collections by mood, cuisine, or vibe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="collections-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Thematic Filter Pills */}
            <div className="collections-filter-scroll">
              {MOOD_FILTERS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`collection-filter-chip ${selectedMood === mood ? 'active' : ''}`}
                >
                  {mood === 'All Collections' && <Compass size={13} />}
                  {mood === 'Rooftops' && <Sparkles size={13} />}
                  {mood === 'Romantic' && <Heart size={13} />}
                  {mood === 'Regional' && <UtensilsCrossed size={13} />}
                  {mood === 'Trending' && <Flame size={13} />}
                  <span>{mood}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Thematic Curated Guides Gallery */}
      <section className="collections-gallery-section">
        <div className="collections-container">
          <div className="gallery-header-row">
            <div>
              <span className="gallery-section-eyebrow">Thematic Experiences</span>
              <h2 className="gallery-section-title">Trending Handpicked Collections</h2>
            </div>
            <span className="gallery-count-badge">
              {filteredCollections.length} Curated Guides
            </span>
          </div>

          <div className="thematic-guides-grid">
            {filteredCollections.map((item) => (
              <div
                key={item.id}
                className={`thematic-guide-card ${activeCollectionId === item.id ? 'selected-card' : ''}`}
                onClick={() => {
                  setActiveCollectionId(item.id);
                  const target = document.getElementById('collection-venues');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="thematic-img-frame">
                  <img src={item.image} alt={item.name} className="thematic-cover-photo" />
                  <div className="thematic-card-overlay" />
                </div>

                <div className="thematic-card-body">
                  <div className="thematic-top-pills">
                    <span className="thematic-places-pill">
                      <MapPin size={11} /> {item.places}
                    </span>
                    <span className="thematic-tag-pill">{item.tag}</span>
                  </div>

                  <h3 className="thematic-card-title">{item.name}</h3>
                  <p className="thematic-card-desc">{item.description}</p>

                  <div className="thematic-explore-action">
                    <span>Explore venues</span>
                    <ArrowRight size={14} className="explore-arrow" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Venues in Selected Collection Showcase */}
      <section className="collections-venues-section" id="collection-venues">
        <div className="collections-container">
          <div className="venues-section-header">
            <div className="venues-header-left">
              <span className="venues-eyebrow">
                <Flame size={14} className="text-orange" /> Handpicked Tables
              </span>
              <h2 className="venues-title">
                Venues in <span className="highlight-text">{currentCollection.name}</span>
              </h2>
              <p className="venues-subtitle">
                {currentCollection.description} Verified for ambience, culinary excellence, and exceptional service.
              </p>
            </div>

            <Link to="/dining" className="view-all-dining-btn">
              <span>View Dining Hub</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Venues Grid */}
          <div className="venues-cards-grid">
            {allVenues.map((venue) => (
              <div key={venue.id} className="curated-venue-card">
                <div className="venue-img-wrap">
                  <img src={venue.image} alt={venue.name} className="venue-img" />
                  <div className="venue-img-overlay" />

                  {/* Top Floating Badges */}
                  <div className="venue-top-badges">
                    <span className="venue-discount-chip">
                      <Sparkles size={11} /> {venue.discount || 'Special Offer'}
                    </span>
                    <span className="venue-rating-badge">
                      <Star size={12} fill="currentColor" /> {venue.rating}
                    </span>
                  </div>

                  <span className="venue-neighborhood-tag">
                    <MapPin size={11} /> {venue.neighborhood || 'City Center'}
                  </span>
                </div>

                <div className="venue-info-body">
                  <div className="venue-title-row">
                    <h3 className="venue-name">{venue.name}</h3>
                    <span className="venue-price-level">{venue.priceLevel || '$$$'}</span>
                  </div>

                  <p className="venue-cuisine-text">{venue.cuisine}</p>

                  <p className="venue-address-text">
                    <MapPin size={13} className="inline-pin" /> {venue.address}
                  </p>

                  {/* Vibe Tags */}
                  <div className="venue-vibes-row">
                    {venue.vibes && venue.vibes.map((vibe, idx) => (
                      <span key={idx} className="venue-vibe-pill">{vibe}</span>
                    ))}
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="venue-actions-strip">
                    <div className="venue-price-wrap">
                      <span className="price-label">Price for two</span>
                      <strong className="price-val">${venue.priceForTwo}</strong>
                    </div>

                    <div className="venue-btns-group">
                      <button
                        type="button"
                        className="venue-reserve-btn"
                        onClick={() => navigate(`/dining/booking/${venue.id}`)}
                      >
                        <CalendarCheck size={14} />
                        <span>Reserve</span>
                      </button>

                      <button
                        type="button"
                        className="venue-delivery-btn"
                        onClick={() => navigate('/explore-menu')}
                        title="Order Delivery"
                      >
                        <UtensilsCrossed size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Partner Restaurants Directory Strip */}
      {restaurants_data && restaurants_data.length > 0 && (
        <section className="collections-partners-section">
          <div className="collections-container">
            <div className="partners-strip-header">
              <h3>Popular Eateries on Delivery</h3>
              <Link to="/restaurants" className="partners-see-all">
                All Restaurants ({restaurants_data.length}) <ArrowRight size={14} />
              </Link>
            </div>

            <div className="partners-compact-grid">
              {restaurants_data.map((res) => (
                <Link to={`/restaurant/${res.id}`} key={res.id} className="partner-compact-card">
                  <img src={res.image} alt={res.name} className="partner-thumb" />
                  <div className="partner-compact-meta">
                    <span className="partner-name">{res.name}</span>
                    <span className="partner-rating">
                      <Star size={11} fill="currentColor" /> {res.rating || '4.5'}
                    </span>
                    <span className="partner-desc">{res.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CollectionsPage;
