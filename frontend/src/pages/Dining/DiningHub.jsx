import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  Search, Star, MapPin, Calendar, Clock, Users, Tag, 
  Sparkles, Wine, Compass, CheckCircle, ChevronRight, 
  Flame, ArrowRight, Utensils, Award, ShieldCheck, Heart
} from 'lucide-react';
import './DiningHub.css';

const MOOD_COLLECTIONS = [
  { 
    id: 'rooftop', 
    name: 'Rooftop & Sky Lounges', 
    icon: '🌆', 
    desc: 'Panoramic skyline views & sunset cocktails',
    bgImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'romantic', 
    name: 'Romantic Candlelight', 
    icon: '🕯️', 
    desc: 'Intimate booths & quiet garden patios',
    bgImg: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'luxury', 
    name: 'Michelin & Fine Dining', 
    icon: '✨', 
    desc: 'Curated omakase, wagyu & chef tasting',
    bgImg: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'brunch', 
    name: 'Weekend Brunch & Buffets', 
    icon: '🥞', 
    desc: 'Unlimited artisanal spreads & mimosas',
    bgImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'brewery', 
    name: 'Taprooms & Live Gigs', 
    icon: '🍻', 
    desc: 'House craft brews & smoky grills',
    bgImg: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop'
  },
];

const DiningHub = () => {
  const navigate = useNavigate();
  const { diningVenues, diningReservations } = useContext(StoreContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('ALL');
  const [selectedGuestFilter, setSelectedGuestFilter] = useState('2');

  // Filter dining venues
  const filteredVenues = (diningVenues || []).filter((venue) => {
    // Search Term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = venue.name?.toLowerCase().includes(q);
      const matchCuisine = venue.cuisine?.toLowerCase().includes(q);
      const matchAddress = venue.address?.toLowerCase().includes(q);
      const matchVibe = venue.vibes?.some(v => v.toLowerCase().includes(q));
      if (!matchName && !matchCuisine && !matchAddress && !matchVibe) return false;
    }

    // Mood Filter
    if (selectedMood === 'rooftop' && !venue.vibes?.some(v => v.toLowerCase().includes('rooftop'))) return false;
    if (selectedMood === 'romantic' && !venue.vibes?.some(v => v.toLowerCase().includes('romantic'))) return false;
    if (selectedMood === 'luxury' && venue.priceLevel !== '$$$$') return false;
    if (selectedMood === 'brewery' && !venue.cuisine?.toLowerCase().includes('beer') && !venue.cuisine?.toLowerCase().includes('craft')) return false;

    // Neighborhood
    if (selectedNeighborhood !== 'ALL' && venue.neighborhood !== selectedNeighborhood) return false;

    return true;
  });

  const upcomingReservationsCount = (diningReservations || []).filter(r => r.status === 'CONFIRMED' || r.status === 'SEATED').length;

  return (
    <div className="dining-hub-container fade-in">
      {/* Warm Premium Hero Showcase */}
      <div className="dining-hero-banner">
        <div className="hero-content-wrapper">
          <div className="hero-badge">
            <Sparkles size={15} />
            <span>Priority Table Booking • Flat 20%–30% Off Food Bills</span>
          </div>

          <h1 className="hero-title">
            Reserve The City's Most Coveted Dining Tables
          </h1>
          <p className="hero-subtitle">
            Skip the waiting lines with instant table confirmations, exclusive dining perks, and seamless table billing discounts.
          </p>

          {/* Elevated Search Docket */}
          <div className="dining-search-docket">
            <div className="search-field-unit">
              <Compass size={18} className="field-icon" />
              <div className="field-texts">
                <span className="field-label">Location</span>
                <select 
                  value={selectedNeighborhood} 
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="search-select"
                >
                  <option value="ALL">All Neighborhoods</option>
                  <option value="Midtown East">Midtown East</option>
                  <option value="SoHo">SoHo</option>
                  <option value="Hudson Yards">Hudson Yards</option>
                  <option value="Flatiron">Flatiron</option>
                  <option value="Hell's Kitchen">Hell's Kitchen</option>
                  <option value="Williamsburg">Williamsburg</option>
                </select>
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field-unit">
              <Users size={18} className="field-icon" />
              <div className="field-texts">
                <span className="field-label">Guests</span>
                <select 
                  value={selectedGuestFilter} 
                  onChange={(e) => setSelectedGuestFilter(e.target.value)}
                  className="search-select"
                >
                  <option value="1">1 Guest (Solo)</option>
                  <option value="2">2 Guests (Couple)</option>
                  <option value="4">4 Guests (Group)</option>
                  <option value="6">6+ Guests (Banquet)</option>
                </select>
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field-unit main-search-field">
              <Search size={18} className="field-icon" />
              <input 
                type="text" 
                placeholder="Search restaurant, cuisine, rooftop..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-text-input"
              />
            </div>

            <button 
              type="button" 
              className="docket-action-btn"
              onClick={() => {
                const venueSec = document.getElementById('featured-venues-section');
                if (venueSec) venueSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Find Table</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Reservation Quick-Access Bar (if any) */}
      {upcomingReservationsCount > 0 && (
        <div className="active-reservations-alert">
          <div className="alert-left">
            <div className="pulse-dot" />
            <div>
              <strong>You have {upcomingReservationsCount} active dining reservation{upcomingReservationsCount > 1 ? 's' : ''}!</strong>
              <p>Your digital QR pass is ready for host check-in.</p>
            </div>
          </div>
          <Link to="/my-dining" className="view-passes-btn">
            View Dining Passes <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Mood & Atmosphere Collections */}
      <div className="dining-section">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">Curated Collections</span>
            <h2 className="section-heading">Ambience & Moods</h2>
            <p className="section-subtext">Pick a dining atmosphere tailored to your special occasion</p>
          </div>
          <button 
            type="button" 
            className={`mood-reset-btn ${selectedMood === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedMood('ALL')}
          >
            Show All Moods
          </button>
        </div>

        <div className="mood-carousel-grid">
          {MOOD_COLLECTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <div 
                key={mood.id} 
                className={`mood-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedMood(isSelected ? 'ALL' : mood.id)}
                style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%), url(${mood.bgImg})` }}
              >
                <div className="mood-badge-top">
                  <span className="mood-icon-emoji">{mood.icon}</span>
                  {isSelected && <span className="active-check">✓ Active</span>}
                </div>
                <div className="mood-bottom-info">
                  <h3 className="mood-name">{mood.name}</h3>
                  <p className="mood-desc">{mood.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dining Perks & Value Strip */}
      <div className="dining-perks-strip">
        <div className="perk-item">
          <div className="perk-icon-wrap bg-orange">
            <Sparkles size={20} className="text-orange" />
          </div>
          <div>
            <h4>Instant Confirmation</h4>
            <p>Direct reservation sync with restaurant host</p>
          </div>
        </div>

        <div className="perk-item">
          <div className="perk-icon-wrap bg-emerald">
            <Tag size={20} className="text-emerald" />
          </div>
          <div>
            <h4>Up to 30% Off Bills</h4>
            <p>Exclusive discounts on total food bill</p>
          </div>
        </div>

        <div className="perk-item">
          <div className="perk-icon-wrap bg-amber">
            <Wine size={20} className="text-amber" />
          </div>
          <div>
            <h4>Complimentary Perks</h4>
            <p>Welcome drinks or chef dessert included</p>
          </div>
        </div>

        <div className="perk-item">
          <div className="perk-icon-wrap bg-blue">
            <ShieldCheck size={20} className="text-blue" />
          </div>
          <div>
            <h4>Zero Cancellation Fee</h4>
            <p>Modify or cancel easily before your booking</p>
          </div>
        </div>
      </div>

      {/* Featured Dining Venues Section */}
      <div className="dining-section" id="featured-venues-section">
        <div className="section-header-flex">
          <div>
            <span className="section-eyebrow">Partner Restaurants</span>
            <h2 className="section-heading">Featured Dining Venues ({filteredVenues.length})</h2>
            <p className="section-subtext">Verified partner tables with priority seating and exclusive discounts</p>
          </div>

          <div className="dining-filter-tags">
            <button 
              type="button" 
              className={`filter-tag-pill ${selectedMood === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedMood('ALL')}
            >
              All
            </button>
            <button 
              type="button" 
              className={`filter-tag-pill ${selectedMood === 'rooftop' ? 'active' : ''}`}
              onClick={() => setSelectedMood('rooftop')}
            >
              🌆 Rooftops
            </button>
            <button 
              type="button" 
              className={`filter-tag-pill ${selectedMood === 'romantic' ? 'active' : ''}`}
              onClick={() => setSelectedMood('romantic')}
            >
              🕯️ Romantic
            </button>
            <button 
              type="button" 
              className={`filter-tag-pill ${selectedMood === 'luxury' ? 'active' : ''}`}
              onClick={() => setSelectedMood('luxury')}
            >
              💎 Fine Dining
            </button>
          </div>
        </div>

        <div className="venues-cards-grid">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className="venue-card">
              {/* Photo & Badge Overlays */}
              <div className="venue-image-container">
                <img src={venue.image} alt={venue.name} className="venue-cover-img" />
                <div className="venue-discount-badge">
                  <Flame size={14} />
                  <span>{venue.discount}</span>
                </div>
                <div className="venue-rating-badge">
                  <Star size={13} fill="currentColor" />
                  <span>{venue.diningRating}</span>
                  <span className="reviews-count">({venue.reviewsCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="venue-body">
                <div className="venue-top-info">
                  <h3 className="venue-name">{venue.name}</h3>
                  <span className="venue-price-level">{venue.priceLevel}</span>
                </div>

                <p className="venue-tagline">{venue.tagline}</p>
                <p className="venue-cuisine">{venue.cuisine}</p>

                {/* Vibe Tags */}
                <div className="venue-vibe-tags">
                  {venue.vibes?.slice(0, 3).map((v, i) => (
                    <span key={i} className="vibe-tag">#{v}</span>
                  ))}
                </div>

                <div className="venue-meta-row">
                  <div className="meta-left">
                    <MapPin size={14} className="meta-icon" />
                    <span>{venue.neighborhood}</span>
                  </div>
                  <div className="meta-right">
                    <span>${venue.priceForTwo} for two</span>
                  </div>
                </div>

                {/* Seating Zones Preview */}
                <div className="venue-seating-preview">
                  <span className="seating-label">Zones:</span>
                  <div className="seating-chips-wrap">
                    {venue.seatingZones?.slice(0, 2).map((zone, idx) => (
                      <span key={idx} className="zone-chip">{zone}</span>
                    ))}
                    {venue.seatingZones?.length > 2 && (
                      <span className="zone-chip more">+{venue.seatingZones.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="venue-card-actions">
                  <button 
                    type="button"
                    className="book-table-action-btn"
                    onClick={() => navigate(`/dining/book/${venue.id}`)}
                  >
                    <span>Reserve Table</span>
                    <ArrowRight size={15} />
                  </button>
                  <Link 
                    to={`/restaurant/${venue.id?.replace('d', '') || '1'}`} 
                    className="view-menu-action-btn"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiningHub;
