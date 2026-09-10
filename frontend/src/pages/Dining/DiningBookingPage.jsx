import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  UtensilsCrossed, 
  ArrowLeft, 
  Wine, 
  ShieldCheck, 
  Share2,
  PhoneCall,
  QrCode,
  Compass
} from 'lucide-react';
import Button from '../../components/ui/Button';
import './DiningBookingPage.css';

const TIME_SLOTS = {
  LUNCH: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'],
  DINNER: ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'],
  BRUNCH: ['10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
};

const OCCASIONS = [
  { id: 'CASUAL', label: 'Casual Dining', icon: '🍽️' },
  { id: 'DATE_NIGHT', label: 'Date Night', icon: '🍷' },
  { id: 'BIRTHDAY', label: 'Birthday Celebration', icon: '🎂' },
  { id: 'ANNIVERSARY', label: 'Anniversary', icon: '💐' },
  { id: 'BUSINESS_MEETING', label: 'Business Meeting', icon: '💼' },
  { id: 'FAMILY_GATHERING', label: 'Family Gathering', icon: '👨‍👩‍👧‍👦' },
];

const SEATING_ZONES = [
  { id: 'ROOFTOP_TERRACE', label: 'Rooftop Sky Lounge', desc: 'Panoramic city skyline views and open-air breeze', icon: '🌆' },
  { id: 'ROMANTIC_WINDOW', label: 'Romantic Window Booth', desc: 'Cozy private table facing glass windows with mood lighting', icon: '🕯️' },
  { id: 'GARDEN_PATIO', label: 'Outdoor Garden Patio', desc: 'Enchanted botanical courtyard seating', icon: '🌿' },
  { id: 'MAIN_DINING', label: 'Main Dining Hall', desc: 'Vibrant atmosphere with views of the open display kitchen', icon: '🏛️' },
  { id: 'PRIVATE_VIP', label: 'Private VIP Room', desc: 'Exclusive insulated dining salon for private groups', icon: '👑' },
];

const DiningBookingPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { diningVenues, bookDiningTable, userProfile } = useContext(StoreContext);

  // Find venue
  const venue = diningVenues.find((v) => String(v.id) === String(restaurantId)) || diningVenues[0];

  // Booking Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [mealType, setMealType] = useState('DINNER');
  const [selectedTime, setSelectedTime] = useState('7:30 PM');
  const [guestCount, setGuestCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState('ROOFTOP_TERRACE');
  const [occasion, setOccasion] = useState('DATE_NIGHT');
  const [specialRequests, setSpecialRequests] = useState('');
  const [guestName, setGuestName] = useState(userProfile?.name || 'Sarah Jenkins');
  const [guestPhone, setGuestPhone] = useState('+1 (555) 234-8901');
  const [guestEmail, setGuestEmail] = useState(userProfile?.email || 'sarah.jenkins@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      restaurantId: venue.id,
      restaurantName: venue.name,
      restaurantAddress: venue.address,
      restaurantImage: venue.image,
      date: selectedDate,
      time: selectedTime,
      mealType,
      guestCount,
      seatingArea,
      occasion,
      specialRequests,
      guestName,
      guestPhone,
      guestEmail,
      discountPercent: venue.discountPercent || 20,
    };

    const reservation = await bookDiningTable(bookingPayload);
    setIsSubmitting(false);
    setConfirmedReservation(reservation);
  };

  // If Confirmed, render the Digital Dining Pass
  if (confirmedReservation) {
    return (
      <div className="dining-booking-page fade-in">
        <div className="digital-pass-card">
          <div className="pass-top-header">
            <div className="success-badge-circle">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="pass-title">Table Reservation Confirmed!</h1>
            <p className="pass-subtitle">
              Your table is reserved at <strong>{venue.name}</strong>. Please present this digital pass upon arrival.
            </p>
          </div>

          <div className="pass-ticket-docket">
            <div className="docket-top-strip">
              <div>
                <span className="docket-eyebrow">Digital Dining Pass</span>
                <h3 className="docket-venue-name">{venue.name}</h3>
                <span className="docket-address"><MapPin size={13} /> {venue.address}</span>
              </div>
              <div className="qr-box">
                <QrCode size={64} className="qr-icon" />
                <span className="qr-ref-code">{confirmedReservation.bookingReference}</span>
              </div>
            </div>

            <div className="docket-grid">
              <div className="docket-grid-item">
                <span className="item-label"><Calendar size={14} /> Date</span>
                <strong className="item-value">{confirmedReservation.date}</strong>
              </div>
              <div className="docket-grid-item">
                <span className="item-label"><Clock size={14} /> Time Slot</span>
                <strong className="item-value">{confirmedReservation.time} ({confirmedReservation.mealType})</strong>
              </div>
              <div className="docket-grid-item">
                <span className="item-label"><Users size={14} /> Party Size</span>
                <strong className="item-value">{confirmedReservation.guestCount} {confirmedReservation.guestCount === 1 ? 'Guest' : 'Guests'}</strong>
              </div>
              <div className="docket-grid-item">
                <span className="item-label"><UtensilsCrossed size={14} /> Seating Zone</span>
                <strong className="item-value">{confirmedReservation.seatingArea.replace(/_/g, ' ')}</strong>
              </div>
              <div className="docket-grid-item">
                <span className="item-label"><Sparkles size={14} /> Occasion</span>
                <strong className="item-value">{confirmedReservation.occasion.replace(/_/g, ' ')}</strong>
              </div>
              <div className="docket-grid-item">
                <span className="item-label"><Tag size={14} /> Dining Perk</span>
                <strong className="item-value text-emerald">{confirmedReservation.discountPercent}% Off Total Bill</strong>
              </div>
            </div>

            {confirmedReservation.specialRequests && (
              <div className="docket-notes">
                <span className="item-label">Special Requests</span>
                <p>"{confirmedReservation.specialRequests}"</p>
              </div>
            )}

            <div className="docket-footer-bar">
              <div className="guest-info">
                <span>Reserved For: <strong>{confirmedReservation.guestName}</strong> ({confirmedReservation.guestPhone})</span>
              </div>
              <span className="status-pill confirmed">STATUS: CONFIRMED</span>
            </div>
          </div>

          <div className="pass-actions-row">
            <Button 
              variant="primary"
              onClick={() => navigate('/my-dining')}
            >
              View in My Bookings
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setConfirmedReservation(null)}
            >
              Book Another Table
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dining-booking-page fade-in">
      <div className="booking-page-header">
        <Link to="/dining" className="back-link">
          <ArrowLeft size={16} /> Back to Dining Venues
        </Link>
        <div className="venue-hero-snippet">
          <img src={venue.image} alt={venue.name} className="snippet-img" />
          <div>
            <div className="snippet-meta">
              <span className="snippet-rating"><Star size={14} fill="currentColor" /> {venue.diningRating}</span>
              <span className="snippet-dot">•</span>
              <span className="snippet-price">{venue.priceLevel} (${venue.priceForTwo} for two)</span>
              <span className="snippet-dot">•</span>
              <span className="snippet-offer">{venue.discount}</span>
            </div>
            <h1 className="snippet-title">Reserve a Table at {venue.name}</h1>
            <p className="snippet-address"><MapPin size={14} /> {venue.address}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleBookingSubmit} className="booking-interactive-grid">
        {/* Step 1: Date & Service Time */}
        <div className="booking-card-step">
          <div className="step-header">
            <div className="step-number">1</div>
            <div>
              <h2 className="step-title">Select Date & Dining Service</h2>
              <p className="step-desc">Pick your preferred dining date and meal session</p>
            </div>
          </div>

          <div className="step-body">
            {/* Date Input */}
            <div className="form-group">
              <label className="input-label">
                <Calendar size={16} /> Reservation Date
              </label>
              <input 
                type="date" 
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="custom-date-input"
                required
              />
            </div>

            {/* Meal Service Selection */}
            <div className="form-group">
              <label className="input-label">Meal Service</label>
              <div className="meal-pill-group">
                {[
                  { id: 'LUNCH', label: 'Lunch', times: '12:00 PM – 3:00 PM' },
                  { id: 'DINNER', label: 'Dinner', times: '6:30 PM – 10:30 PM' },
                  { id: 'BRUNCH', label: 'Weekend Brunch', times: '10:30 AM – 1:00 PM' }
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    className={`meal-pill-btn ${mealType === m.id ? 'active' : ''}`}
                    onClick={() => {
                      setMealType(m.id);
                      setSelectedTime(TIME_SLOTS[m.id][0]);
                    }}
                  >
                    <span className="meal-name">{m.label}</span>
                    <span className="meal-hours">{m.times}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Time Slots */}
            <div className="form-group">
              <label className="input-label">
                <Clock size={16} /> Available Seating Slots (Instant Confirmation)
              </label>
              <div className="slots-chips-grid">
                {TIME_SLOTS[mealType]?.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`slot-pill ${selectedTime === slot ? 'active' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Party Size & Seating Zone */}
        <div className="booking-card-step">
          <div className="step-header">
            <div className="step-number">2</div>
            <div>
              <h2 className="step-title">Party Size & Seating Zone</h2>
              <p className="step-desc">Tailor your seating ambience and view preference</p>
            </div>
          </div>

          <div className="step-body">
            {/* Guests Stepper */}
            <div className="form-group">
              <label className="input-label">
                <Users size={16} /> Number of Guests
              </label>
              <div className="guests-counter-bar">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <div className="guests-value-badge">
                  <span className="count-num">{guestCount}</span>
                  <span className="count-label">{guestCount === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setGuestCount((prev) => Math.min(16, prev + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Seating Zones */}
            <div className="form-group">
              <label className="input-label">Ambience & Seating Zone</label>
              <div className="zones-selector-stack">
                {SEATING_ZONES.map((zone) => {
                  const isSelected = seatingArea === zone.id;
                  return (
                    <div 
                      key={zone.id}
                      className={`zone-option-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSeatingArea(zone.id)}
                    >
                      <span className="zone-icon">{zone.icon}</span>
                      <div className="zone-text">
                        <h4 className="zone-name">{zone.label}</h4>
                        <p className="zone-sub">{zone.desc}</p>
                      </div>
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Occasion & Contact Details */}
        <div className="booking-card-step">
          <div className="step-header">
            <div className="step-number">3</div>
            <div>
              <h2 className="step-title">Occasion & Guest Contact</h2>
              <p className="step-desc">Help the venue personalize your experience</p>
            </div>
          </div>

          <div className="step-body">
            {/* Occasion Selection */}
            <div className="form-group">
              <label className="input-label">What's the Occasion?</label>
              <div className="occasions-chips-row">
                {OCCASIONS.map((occ) => (
                  <button
                    type="button"
                    key={occ.id}
                    className={`occasion-pill ${occasion === occ.id ? 'active' : ''}`}
                    onClick={() => setOccasion(occ.id)}
                  >
                    <span>{occ.icon}</span>
                    <span>{occ.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="form-group">
              <label className="input-label">Special Requests (Optional)</label>
              <input 
                type="text"
                placeholder="E.g., Window table, high chair, birthday candle, quiet booth..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="custom-text-input"
              />
            </div>

            {/* Guest Contact Details */}
            <div className="contact-fields-grid">
              <div className="form-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  value={guestName} 
                  onChange={(e) => setGuestName(e.target.value)}
                  className="custom-text-input"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="input-label">Phone Number (For SMS Pass)</label>
                <input 
                  type="tel" 
                  value={guestPhone} 
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="custom-text-input"
                  required 
                />
              </div>

              <div className="form-group full-span">
                <label className="input-label">Email Address</label>
                <input 
                  type="email" 
                  value={guestEmail} 
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="custom-text-input"
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary & Submit Card */}
        <div className="booking-summary-card">
          <h3 className="summary-title">Reservation Summary</h3>
          
          <div className="summary-rows-stack">
            <div className="summary-row">
              <span className="label">Venue</span>
              <strong className="val">{venue.name}</strong>
            </div>
            <div className="summary-row">
              <span className="label">Date & Time</span>
              <strong className="val">{selectedDate} at {selectedTime}</strong>
            </div>
            <div className="summary-row">
              <span className="label">Party</span>
              <strong className="val">{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</strong>
            </div>
            <div className="summary-row">
              <span className="label">Seating Area</span>
              <strong className="val">{seatingArea.replace(/_/g, ' ')}</strong>
            </div>
            <div className="summary-row">
              <span className="label">Occasion</span>
              <strong className="val">{occasion.replace(/_/g, ' ')}</strong>
            </div>
            <div className="summary-row highlight">
              <span className="label">Exclusive Perk</span>
              <strong className="val text-emerald">{venue.discount}</strong>
            </div>
          </div>

          <div className="trust-pills-row">
            <div className="trust-pill"><ShieldCheck size={14} /> Instant Confirmation</div>
            <div className="trust-pill"><CheckCircle2 size={14} /> Free Cancellation</div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="confirm-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming Table...' : `Confirm Reservation for ${guestCount} Guests`}
          </Button>
          <p className="terms-note">By clicking confirm, your table reservation pass will be generated instantly.</p>
        </div>
      </form>
    </div>
  );
};

export default DiningBookingPage;
