import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  Sparkles, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Tag, 
  Ticket, 
  Music, 
  Flame, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Mic,
  Utensils
} from 'lucide-react';
import Button from '../../components/ui/Button';
import './LiveEventsHub.css';

const CATEGORIES = [
  { id: 'ALL', label: 'All Experiences', icon: '✨' },
  { id: 'CONCERT', label: 'Concerts & Music', icon: '🎵' },
  { id: 'FOOD_FESTIVAL', label: 'Food & Wine Festivals', icon: '🍷' },
  { id: 'COMEDY', label: 'Standup Comedy', icon: '🎤' },
  { id: 'WORKSHOP', label: 'Chef Masterclasses', icon: '👨‍🍳' },
  { id: 'ROOFTOP_GIG', label: 'Rooftop & Candlelight', icon: '🕯️' },
  { id: 'NIGHTLIFE', label: 'Nightlife & DJ Sets', icon: '🪩' },
];

const LiveEventsHub = () => {
  const navigate = useNavigate();
  const { liveEvents, eventTickets } = useContext(StoreContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('ALL');

  // Filter events
  const filteredEvents = (liveEvents || []).filter((event) => {
    // Category
    if (selectedCategory !== 'ALL' && event.category !== selectedCategory) return false;

    // Neighborhood
    if (selectedNeighborhood !== 'ALL' && event.neighborhood !== selectedNeighborhood) return false;

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = event.title?.toLowerCase().includes(q);
      const matchArtist = event.artistName?.toLowerCase().includes(q);
      const matchVenue = event.venueName?.toLowerCase().includes(q);
      const matchTag = event.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchArtist && !matchVenue && !matchTag) return false;
    }

    return true;
  });

  const activeTicketsCount = (eventTickets || []).filter(t => t.status === 'CONFIRMED').length;

  return (
    <div className="live-events-hub fade-in">
      {/* Hero Showcase */}
      <div className="events-hero-showcase">
        <div className="hero-content">
          <div className="hero-live-badge">
            <span className="live-pulse-dot" />
            <span>Tomato Live & Entertainment</span>
          </div>
          <h1 className="hero-heading">
            Live Concerts, Food Festivals & Unforgettable Nights
          </h1>
          <p className="hero-subtext">
            Discover the city's most sought-after music spectacles, chef-curated tasting festivals, comedy galas, and intimate rooftop acoustic sessions.
          </p>

          {/* Quick Search & City Docket */}
          <div className="events-search-bar">
            <div className="search-unit location-unit">
              <Compass size={18} className="unit-icon" />
              <div className="unit-text">
                <span className="unit-label">Neighborhood</span>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="unit-select"
                >
                  <option value="ALL">All Neighborhoods</option>
                  <option value="Williamsburg">Williamsburg</option>
                  <option value="Meatpacking District">Meatpacking District</option>
                  <option value="Gramercy">Gramercy</option>
                  <option value="Financial District">Financial District</option>
                  <option value="Lower Manhattan">Lower Manhattan</option>
                  <option value="Bushwick">Bushwick</option>
                </select>
              </div>
            </div>

            <div className="search-bar-divider" />

            <div className="search-unit input-unit">
              <Search size={18} className="unit-icon" />
              <input
                type="text"
                placeholder="Search artists, food festivals, venues, standup..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="event-input-field"
              />
            </div>

            <button type="button" className="find-events-btn">
              Explore Events
            </button>
          </div>
        </div>
      </div>

      {/* Active Passes Alert Bar */}
      {activeTicketsCount > 0 && (
        <div className="active-tickets-alert">
          <div className="alert-left-section">
            <div className="ticket-icon-box">
              <Ticket size={22} />
            </div>
            <div>
              <strong>You have {activeTicketsCount} active event pass{activeTicketsCount > 1 ? 'es' : ''}!</strong>
              <p>Your digital entry QR code is ready for venue gate check-in.</p>
            </div>
          </div>
          <Link to="/my-tickets" className="view-tickets-cta">
            View My Event Passes <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Categories Toolbar */}
      <div className="events-categories-bar">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Perks Banner */}
      <div className="events-trust-strip">
        <div className="trust-cell">
          <ShieldCheck size={20} className="trust-icon emerald" />
          <div>
            <h4>100% Verified Entry</h4>
            <p>Direct official partner ticketing with encrypted QR passes</p>
          </div>
        </div>
        <div className="trust-cell">
          <Tag size={20} className="trust-icon orange" />
          <div>
            <h4>Dining & Drink Perks</h4>
            <p>Exclusive bundled food truck tokens & complimentary drinks</p>
          </div>
        </div>
        <div className="trust-cell">
          <CheckCircle2 size={20} className="trust-icon blue" />
          <div>
            <h4>Instant Mobile Passes</h4>
            <p>No printing needed, scan directly from your phone wallet</p>
          </div>
        </div>
      </div>

      {/* Events Grid Header */}
      <div className="events-list-header">
        <div>
          <h2 className="section-title">Live & Upcoming Experiences ({filteredEvents.length})</h2>
          <p className="section-subtitle">Verified headliners and exclusive food festivals</p>
        </div>
        {selectedCategory !== 'ALL' && (
          <button
            type="button"
            className="clear-cat-btn"
            onClick={() => setSelectedCategory('ALL')}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Event Cards Grid */}
      <div className="events-cards-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            {/* Poster & Badges */}
            <div className="card-poster-wrap">
              <img src={event.imageUrl} alt={event.title} className="event-poster-img" />
              
              <div className="badge-overlay-top">
                <span className="category-pill-tag">
                  {event.categoryLabel || event.category}
                </span>
                {event.status === 'SELLING_FAST' && (
                  <span className="selling-fast-badge">
                    <Flame size={12} /> Selling Fast
                  </span>
                )}
                {event.status === 'ALMOST_FULL' && (
                  <span className="almost-full-badge">
                    Few Tickets Left
                  </span>
                )}
              </div>

              <div className="date-badge-bottom">
                <span className="date-badge-text">
                  <Calendar size={13} /> {event.dateDisplay}
                </span>
              </div>
            </div>

            {/* Event Card Body */}
            <div className="event-card-body">
              <h3 className="event-title">{event.title}</h3>
              <span className="event-artist">{event.artistName}</span>
              <p className="event-tagline">{event.tagline}</p>

              {/* Tags */}
              <div className="event-tags-row">
                {event.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="event-mini-tag">#{tag}</span>
                ))}
              </div>

              {/* Venue & Time info */}
              <div className="event-venue-meta">
                <div className="venue-line">
                  <MapPin size={14} className="meta-pin" />
                  <span>{event.venueName}, {event.neighborhood}</span>
                </div>
              </div>

              {/* Card Footer: Pricing & Action */}
              <div className="event-card-footer">
                <div className="price-info">
                  <span className="price-label">Tickets from</span>
                  <strong className="price-val">${event.minPrice}</strong>
                </div>

                <Button
                  variant="primary"
                  className="book-ticket-btn"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <Ticket size={16} /> Book Tickets
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEventsHub;
