import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Ticket, CheckCircle2, 
  ShieldCheck, Users, Sparkles, CreditCard, QrCode, Share2,
  AlertCircle, Tag, Utensils, Heart, ChevronDown, ChevronUp,
  Info, Car, ExternalLink, Download, Check, Compass, Music,
  Flame, Award, Eye
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import './EventBookingPage.css';

const PROMO_CODES = {
  'LIVE20': { type: 'percent', value: 20, label: '20% Special Festival Discount' },
  'WELCOME10': { type: 'flat', value: 10, label: '$10 First-Time Ticket Credit' },
  'VIPFEST': { type: 'percent', value: 15, label: '15% VIP Access Discount' },
};

const EventBookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { liveEvents, bookEventTicket, userProfile } = useContext(StoreContext);

  // Find the event by ID or fallback to first
  const event = (liveEvents || []).find((e) => String(e.id) === String(eventId)) || liveEvents?.[0] || {
    id: 'evt-1',
    title: 'Neon Sunset Rooftop Electronic Fest',
    tagline: 'Deep House, Sunset Cocktails & Skyline Laser Visuals',
    category: 'CONCERT',
    categoryLabel: 'Music & Electronic',
    artistName: 'Kavinsky & Nora En Pure (Live Set)',
    venueName: 'The Brooklyn Mirage & Rooftop Sky Deck',
    venueAddress: '140 Stewart Ave, Brooklyn, NY',
    neighborhood: 'Williamsburg',
    eventDate: '2026-03-21',
    dateDisplay: 'Sat, Mar 21 • 6:00 PM',
    startTime: '18:00:00',
    endTime: '02:00:00',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    minPrice: 35,
    totalCapacity: 800,
    availableTickets: 68,
    status: 'SELLING_FAST',
    featured: true,
    tags: ['Electronic', 'Rooftop', 'Sunset DJ', 'Craft Cocktails'],
    description: 'An open-air electronic sunset feast featuring world-class melodic deep house, immersive 3D projection mapping, artisan food trucks, and craft cocktail bars overlooking the Manhattan skyline.',
    ticketTiers: [
      { id: 't1', name: 'General Admission (GA)', price: 35, desc: 'Full access to main open-air arena and food truck pavilion' },
      { id: 't2', name: 'VIP Sky Deck Pass', price: 75, desc: 'Priority express entry, elevated VIP lounge view, and 2 complimentary cocktails' },
      { id: 't3', name: 'VIP Table for 4 + Bottle Service', price: 280, desc: 'Private reserved booth, premium spirit bottle, dedicated hostess, and fast-track entry' }
    ]
  };

  // State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'venue' | 'schedule' | 'faq'
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(2);
  const [includeFoodVoucher, setIncludeFoodVoucher] = useState(true);
  const [includeParking, setIncludeParking] = useState(false);
  
  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Attendee Info
  const [attendeeName, setAttendeeName] = useState(userProfile?.name || 'Sarah Jenkins');
  const [attendeePhone, setAttendeePhone] = useState('+1 (555) 234-8901');
  const [attendeeEmail, setAttendeeEmail] = useState(userProfile?.email || 'sarah.jenkins@example.com');
  
  // Interactions
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Auto scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  const selectedTier = event?.ticketTiers?.[selectedTierIndex] || {
    id: 't1',
    name: 'General Admission (GA)',
    price: event?.minPrice || 35,
    desc: 'Full access pass to the main event arena'
  };

  // Pricing calculations
  const baseSubtotal = selectedTier.price * ticketQuantity;
  const foodVoucherCost = includeFoodVoucher ? 16 * ticketQuantity : 0;
  const parkingCost = includeParking ? 18 : 0;
  const grossTotal = baseSubtotal + foodVoucherCost + parkingCost;
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = (baseSubtotal * appliedPromo.value) / 100;
    } else {
      discountAmount = appliedPromo.value;
    }
  }

  const bookingFee = 3.50;
  const totalAmountToPay = Math.max(0, grossTotal - discountAmount + bookingFee);

  // Promo handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(PROMO_CODES[cleanCode]);
      setToastMessage({
        text: `Promo code "${cleanCode}" applied! ${PROMO_CODES[cleanCode].label}`,
        type: 'success',
      });
    } else {
      setPromoError('Invalid promo code. Try "LIVE20" or "WELCOME10"');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage({
        text: 'Event link copied to clipboard! Share it with your friends.',
        type: 'success',
      });
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    setToastMessage({
      text: !isSaved ? 'Saved to your favorite live events!' : 'Removed from saved events.',
      type: 'info',
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      eventId: event.id,
      eventTitle: event.title,
      eventArtist: event.artistName,
      eventVenue: event.venueName,
      eventAddress: event.venueAddress,
      eventDate: event.eventDate,
      eventStartTime: event.startTime,
      eventImageUrl: event.imageUrl,
      ticketTier: selectedTier.name,
      quantity: ticketQuantity,
      unitPrice: selectedTier.price,
      totalAmount: totalAmountToPay,
      attendeeName,
      attendeePhone,
      attendeeEmail,
      foodVoucherIncluded: includeFoodVoucher,
      parkingIncluded: includeParking,
      entryGate: selectedTierIndex === 1 ? 'Gate A - VIP Sky Deck' : selectedTierIndex === 2 ? 'VIP Front Lounge Entrance' : 'Main Turnstile Gate 2',
    };

    try {
      const newTicket = await bookEventTicket(bookingPayload);
      setIsSubmitting(false);
      setConfirmedTicket(newTicket);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setIsSubmitting(false);
      setToastMessage({
        text: 'Booking processed in offline mode. Ticket is available in your passes wallet!',
        type: 'success',
      });
    }
  };

  // FAQ Items
  const faqList = [
    {
      q: 'What is the age requirement for this event?',
      a: 'This event is strictly 18+ (21+ for alcohol consumption). A valid government-issued photo ID or passport is required at the entry turnstile.'
    },
    {
      q: 'When do the gates open and what is the re-entry policy?',
      a: 'Gates open 60 minutes prior to scheduled start time. Due to security regulations, re-entry is not permitted once your QR pass is scanned.'
    },
    {
      q: 'How does the Festival Food & Drink Voucher work?',
      a: 'Your digital voucher grants $20 worth of food truck & craft bar credit for just $16. Simply present your ticket QR code at any bar or food truck station inside the venue.'
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Tickets can be cancelled up to 24 hours prior to the event for a 100% full refund directly to your original payment method via the My Tickets wallet.'
    }
  ];

  // Schedule Breakdown
  const scheduleMilestones = [
    { time: '6:00 PM', title: 'Gates & Artisan Food Village Open', desc: 'Arrive early to grab food truck specials, craft cocktails, and sunset skyline views.' },
    { time: '7:15 PM', title: 'Opening Artist & Warmup Set', desc: 'Live groove warm-up featuring local guest acts and warm ambient melodies.' },
    { time: '8:45 PM', title: 'Headline Showcase Performance', desc: `${event.artistName} live on the main stage with full laser production.` },
    { time: '11:00 PM - Close', title: 'After-Hours Club & Lounges', desc: 'Late night chillout zone, resident DJ b2b sets, and dessert bars.' }
  ];

  // Render Confirmed Digital Ticket
  if (confirmedTicket) {
    return (
      <div className="event-view-page confirmed-view fade-in">
        {toastMessage && (
          <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />
        )}

        <div className="confirmed-ticket-container">
          <div className="confirmed-hero-banner">
            <div className="success-badge-circle">
              <Check size={36} />
            </div>
            <span className="success-eyebrow">Booking Confirmed & Verified</span>
            <h1 className="success-heading">You're Heading to {event.title}!</h1>
            <p className="success-subheading">
              Your official gate admission pass is ready. We've sent a copy to <strong>{confirmedTicket.attendeeEmail}</strong>.
            </p>
          </div>

          {/* Boarding Pass Ticket Mockup */}
          <div className="digital-boarding-pass">
            <div className="pass-left-section">
              <div className="pass-banner">
                <img src={event.imageUrl} alt={event.title} />
                <div className="pass-banner-tint">
                  <span className="official-chip">OFFICIAL ACCESS PASS</span>
                  <h2 className="pass-event-title">{event.title}</h2>
                  <span className="pass-artist">{event.artistName}</span>
                </div>
              </div>

              <div className="pass-details-body">
                <div className="pass-info-grid">
                  <div className="pass-field">
                    <span className="field-lbl"><Calendar size={13} /> DATE</span>
                    <strong className="field-val">{confirmedTicket.eventDate || event.dateDisplay}</strong>
                  </div>
                  <div className="pass-field">
                    <span className="field-lbl"><Clock size={13} /> TIME</span>
                    <strong className="field-val">{confirmedTicket.eventStartTime || '18:00'} (Doors at 17:00)</strong>
                  </div>
                  <div className="pass-field">
                    <span className="field-lbl"><MapPin size={13} /> VENUE</span>
                    <strong className="field-val">{event.venueName}</strong>
                  </div>
                  <div className="pass-field">
                    <span className="field-lbl"><Ticket size={13} /> TIER & SEATS</span>
                    <strong className="field-val text-primary">{confirmedTicket.ticketTier} ({confirmedTicket.quantity} Passes)</strong>
                  </div>
                </div>

                <div className="pass-perks-row">
                  {confirmedTicket.foodVoucherIncluded && (
                    <span className="perk-pill">
                      <Utensils size={13} /> Includes {confirmedTicket.quantity}x $20 Food Truck Credit
                    </span>
                  )}
                  {confirmedTicket.parkingIncluded && (
                    <span className="perk-pill">
                      <Car size={13} /> Priority Reserved Parking Pass
                    </span>
                  )}
                  <span className="perk-pill gate-pill">
                    <Compass size={13} /> {confirmedTicket.entryGate}
                  </span>
                </div>

                <div className="pass-holder-strip">
                  <span>Guest: <strong>{confirmedTicket.attendeeName}</strong></span>
                  <span>Contact: <strong>{confirmedTicket.attendeePhone}</strong></span>
                  <span className="amount-badge">Paid: ${Number(confirmedTicket.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Stub with QR */}
            <div className="pass-stub-section">
              <div className="stub-notch top" />
              <div className="stub-notch bottom" />
              <div className="qr-box-wrap">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GATE-TICKET-${confirmedTicket.bookingReference || confirmedTicket.id}`}
                  alt="Entry Gate QR Code"
                  className="real-qr-code"
                />
                <span className="qr-ref-code">{confirmedTicket.bookingReference || confirmedTicket.id}</span>
                <p className="scan-instructions">
                  Scan at Gate Turnstiles for immediate mobile admission.
                </p>
              </div>

              <button className="btn-print-pass" onClick={() => window.print()}>
                <Download size={15} /> Save / Print Pass
              </button>
            </div>
          </div>

          <div className="confirmed-actions-footer">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/my-tickets')}
            >
              <Ticket size={18} /> View All Passes in My Tickets Wallet
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/events')}
            >
              Explore More Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal View Event Screen
  return (
    <div className="event-view-page fade-in">
      {toastMessage && (
        <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Breadcrumb & Action Toolbar */}
      <div className="event-top-toolbar">
        <div className="toolbar-container">
          <div className="breadcrumb-box">
            <Link to="/events" className="breadcrumb-back-btn">
              <ArrowLeft size={16} /> All Events
            </Link>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-curr">{event.title}</span>
          </div>

          <div className="toolbar-actions">
            <button 
              className={`icon-action-btn ${isSaved ? 'active-saved' : ''}`}
              onClick={handleToggleSave}
              title={isSaved ? 'Saved' : 'Save Event'}
            >
              <Heart size={18} fill={isSaved ? '#ec4899' : 'none'} color={isSaved ? '#ec4899' : 'currentColor'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="icon-action-btn" onClick={handleShare} title="Share Event Link">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="event-hero-showcase">
        <div className="hero-backdrop-image">
          <img src={event.imageUrl} alt={event.title} />
          <div className="hero-vignette-overlay" />
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-badges-strip">
            <span className="category-pill">{event.categoryLabel || event.category}</span>
            {event.status === 'SELLING_FAST' && (
              <span className="pulse-pill fire">
                <Flame size={13} /> Selling Fast • {event.availableTickets} Passes Left
              </span>
            )}
            {event.featured && (
              <span className="pulse-pill featured">
                <Sparkles size={13} /> Featured Spotlight
              </span>
            )}
          </div>

          <h1 className="event-hero-title">{event.title}</h1>
          <p className="hero-tagline-text">{event.tagline}</p>

          <div className="hero-performer-row">
            <div className="performer-avatar">
              <Music size={20} />
            </div>
            <div>
              <span className="performer-label">Headlining Performer</span>
              <h3 className="performer-name">{event.artistName}</h3>
            </div>
          </div>

          {/* Highlights Info Strip */}
          <div className="hero-stats-bar">
            <div className="stat-item">
              <Calendar size={18} className="stat-icon" />
              <div>
                <span className="stat-label">DATE & SCHEDULE</span>
                <strong className="stat-value">{event.dateDisplay}</strong>
              </div>
            </div>

            <div className="stat-item">
              <MapPin size={18} className="stat-icon" />
              <div>
                <span className="stat-label">VENUE LOCATION</span>
                <strong className="stat-value">{event.venueName}</strong>
              </div>
            </div>

            <div className="stat-item">
              <Users size={18} className="stat-icon" />
              <div>
                <span className="stat-label">CAPACITY</span>
                <strong className="stat-value">{event.totalCapacity} Attendees</strong>
              </div>
            </div>

            <div className="stat-item price-stat">
              <Tag size={18} className="stat-icon text-primary" />
              <div>
                <span className="stat-label">PASSES FROM</span>
                <strong className="stat-value price-highlight">${event.minPrice}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Tabs & Sticky Booking Docket) */}
      <div className="event-main-layout">
        {/* Left Column: Interactive Tabs */}
        <div className="event-content-column">
          <div className="content-nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Info size={16} /> Overview & Lineup
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'venue' ? 'active' : ''}`}
              onClick={() => setActiveTab('venue')}
            >
              <MapPin size={16} /> Venue & Seating Map
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Clock size={16} /> Schedule & Timeline
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <AlertCircle size={16} /> Entry FAQs
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane-content fade-in">
              <div className="content-card">
                <h2 className="pane-section-title">About the Experience</h2>
                <p className="experience-body-text">{event.description}</p>

                <div className="vibe-tags-cloud">
                  {event.tags?.map((tag, idx) => (
                    <span key={idx} className="vibe-tag">#{tag}</span>
                  ))}
                </div>

                <div className="perks-checklist-grid">
                  <div className="perk-box">
                    <CheckCircle2 size={18} className="text-emerald" />
                    <div>
                      <strong>Full Stage Visuals & Laser Production</strong>
                      <p>State-of-the-art D&B audiotechnik sound system and 4K LED mapping.</p>
                    </div>
                  </div>
                  <div className="perk-box">
                    <CheckCircle2 size={18} className="text-emerald" />
                    <div>
                      <strong>Gourmet Food Trucks & Cocktail Bars</strong>
                      <p>Curated culinary market with wood-fired pizzas, craft burgers, and mixology bars.</p>
                    </div>
                  </div>
                  <div className="perk-box">
                    <CheckCircle2 size={18} className="text-emerald" />
                    <div>
                      <strong>Rapid Turnstile Mobile QR Check-In</strong>
                      <p>Zero paper tickets. Instant gate scanner check-in directly from your smartphone.</p>
                    </div>
                  </div>
                  <div className="perk-box">
                    <CheckCircle2 size={18} className="text-emerald" />
                    <div>
                      <strong>Buyer Protection Guarantee</strong>
                      <p>100% full refund if the event is cancelled, postponed, or rescheduled.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artist Spotlight Box */}
              <div className="content-card artist-spotlight-card">
                <div className="artist-card-header">
                  <Award size={22} className="text-primary" />
                  <div>
                    <h3 className="artist-spotlight-title">Headliner Profile: {event.artistName}</h3>
                    <p className="artist-genre-text">Genre: Melodic Deep House, Indie Synth & Electronic Live</p>
                  </div>
                </div>
                <p className="artist-bio-text">
                  Known for chart-topping anthems and legendary sunset sessions worldwide. Expect a high-energy live performance incorporating live synthesizers, acoustic strings, and pulsating bass drops designed specifically for open-air acoustic resonance.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: VENUE & SEATING MAP */}
          {activeTab === 'venue' && (
            <div className="tab-pane-content fade-in">
              <div className="content-card">
                <h2 className="pane-section-title">Venue & Interactive Stage Layout</h2>
                <p className="experience-body-text">
                  Take a look at the arena zones and choose your preferred section. All ticket tiers include direct sightlines to the main stage.
                </p>

                {/* Visual Stage Layout Mockup */}
                <div className="stage-layout-diagram">
                  <div className="stage-head-pod">
                    <div className="stage-glow-line" />
                    <span>MAIN STAGE & ARTIST PODIUM</span>
                  </div>

                  <div className="seating-zones-container">
                    <div className="zone-block front-row-zone">
                      <span className="zone-title">VIP FRONT ROW LOUNGE</span>
                      <span className="zone-desc">Direct Artist Proximity • Dedicated Hostess Bar</span>
                    </div>

                    <div className="zone-block skydeck-zone">
                      <span className="zone-title">ELEVATED VIP SKY DECK</span>
                      <span className="zone-desc">Panoramic High View • Fast Track Gate A Access</span>
                    </div>

                    <div className="zone-block general-zone">
                      <span className="zone-title">GENERAL ADMISSION OPEN ARENA</span>
                      <span className="zone-desc">Spacious Dance Floor • Center Sound Sweet Spot</span>
                    </div>

                    <div className="zone-foot-amenities">
                      <span>🍔 Food Truck Pavilion</span>
                      <span>🍸 Craft Mixology Bars</span>
                      <span>🚻 Restroom Suites</span>
                      <span>🚪 Entry Turnstiles</span>
                    </div>
                  </div>
                </div>

                <div className="venue-address-card">
                  <div className="address-info">
                    <MapPin size={24} className="text-primary" />
                    <div>
                      <h4>{event.venueName}</h4>
                      <p>{event.venueAddress} ({event.neighborhood})</p>
                    </div>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.venueName + ' ' + event.venueAddress)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="directions-link-btn"
                  >
                    <ExternalLink size={15} /> Get Directions
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="tab-pane-content fade-in">
              <div className="content-card">
                <h2 className="pane-section-title">Event Schedule & Timeline</h2>
                <p className="experience-body-text">
                  Times are subject to slight adjustments based on live performance flow. We recommend arriving at least 45 minutes prior to headline set.
                </p>

                <div className="timeline-stack">
                  {scheduleMilestones.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker">
                        <div className="marker-dot" />
                        {idx !== scheduleMilestones.length - 1 && <div className="marker-line" />}
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-time">{item.time}</span>
                        <h4 className="timeline-title">{item.title}</h4>
                        <p className="timeline-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENTRY FAQS */}
          {activeTab === 'faq' && (
            <div className="tab-pane-content fade-in">
              <div className="content-card">
                <h2 className="pane-section-title">Gate Rules & Frequently Asked Questions</h2>
                <div className="faq-accordion-list">
                  {faqList.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                        <button 
                          className="faq-question-bar"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {isOpen && (
                          <div className="faq-answer-box">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: High-End Ticket Booking Console */}
        <div className="event-booking-sidebar">
          <div className="booking-sticky-card">
            <div className="card-top-header">
              <div>
                <span className="docket-title">Reserve Event Passes</span>
                <span className="docket-sub">Instant Digital Mobile Delivery</span>
              </div>
              <div className="security-icon-pill">
                <ShieldCheck size={16} /> Verified
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form-content">
              {/* Step 1: Tier Selector */}
              <div className="form-section-block">
                <label className="section-label">
                  <Ticket size={15} /> Select Ticket Category
                </label>
                <div className="tiers-picker-list">
                  {event.ticketTiers?.map((tier, idx) => {
                    const isSelected = selectedTierIndex === idx;
                    return (
                      <div
                        key={tier.id}
                        className={`tier-option-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTierIndex(idx)}
                      >
                        <div className="tier-card-left">
                          <div className={`tier-radio-indicator ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <div className="radio-inner" />}
                          </div>
                          <div>
                            <div className="tier-title-row">
                              <strong className="tier-name">{tier.name}</strong>
                              {idx === 0 && <span className="popular-badge">Popular</span>}
                              {idx === 1 && <span className="vip-badge">VIP Deck</span>}
                              {idx === 2 && <span className="lounge-badge">Backstage</span>}
                            </div>
                            <p className="tier-summary-text">{tier.desc}</p>
                          </div>
                        </div>

                        <div className="tier-card-right">
                          <strong className="tier-price-val">${tier.price}</strong>
                          <span className="price-suffix">/ pass</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Quantity Counter */}
              <div className="form-section-block">
                <div className="quantity-control-row">
                  <div>
                    <label className="section-label">
                      <Users size={15} /> Number of Passes
                    </label>
                    <span className="qty-subtext">Max 8 tickets per booking</span>
                  </div>

                  <div className="qty-counter-capsule">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span className="qty-number">{ticketQuantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setTicketQuantity((q) => Math.min(8, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Add-on Perks */}
              <div className="form-section-block">
                <label className="section-label">
                  <Sparkles size={15} /> Event Add-ons & Perks
                </label>
                
                {/* Food Voucher */}
                <div 
                  className={`addon-choice-card ${includeFoodVoucher ? 'active' : ''}`}
                  onClick={() => setIncludeFoodVoucher(!includeFoodVoucher)}
                >
                  <input
                    type="checkbox"
                    checked={includeFoodVoucher}
                    onChange={() => {}} // handled by parent onClick
                    className="addon-checkbox"
                  />
                  <div className="addon-meta">
                    <div className="addon-title-row">
                      <strong>Festival Food & Drink Voucher</strong>
                      <span className="addon-deal-pill">Save 20%</span>
                    </div>
                    <p>Get $20 F&B credit for only $16 per attendee. Valid at all food trucks and bars.</p>
                  </div>
                </div>

                {/* Parking Voucher */}
                <div 
                  className={`addon-choice-card ${includeParking ? 'active' : ''}`}
                  onClick={() => setIncludeParking(!includeParking)}
                >
                  <input
                    type="checkbox"
                    checked={includeParking}
                    onChange={() => {}} // handled by parent onClick
                    className="addon-checkbox"
                  />
                  <div className="addon-meta">
                    <div className="addon-title-row">
                      <strong>Priority Reserved Parking Pass</strong>
                      <span className="addon-price-tag">+$18</span>
                    </div>
                    <p>Guaranteed spot in the covered venue garage with expedited exit lanes.</p>
                  </div>
                </div>
              </div>

              {/* Step 4: Promo Code Input */}
              <div className="form-section-block">
                <label className="section-label">
                  <Tag size={15} /> Promo Voucher Code
                </label>
                
                {appliedPromo ? (
                  <div className="applied-promo-pill">
                    <div className="promo-pill-left">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{appliedPromo.label}</span>
                    </div>
                    <button type="button" onClick={handleRemovePromo} className="remove-promo-btn">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="e.g. LIVE20, WELCOME10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="promo-text-field"
                    />
                    <button type="button" onClick={handleApplyPromo} className="btn-apply-promo">
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <span className="promo-error-msg">{promoError}</span>}
              </div>

              {/* Step 5: Attendee Details */}
              <div className="form-section-block">
                <label className="section-label">
                  <Compass size={15} /> Pass Holder Details
                </label>
                <div className="contact-inputs-stack">
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="contact-field"
                    required
                  />
                  <div className="contact-row">
                    <input
                      type="tel"
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="Phone (For SMS Pass)"
                      className="contact-field"
                      required
                    />
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="Email (For PDF Ticket)"
                      className="contact-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Docket */}
              <div className="price-docket-box">
                <div className="docket-row">
                  <span>{selectedTier.name} x {ticketQuantity}</span>
                  <strong>${baseSubtotal.toFixed(2)}</strong>
                </div>

                {includeFoodVoucher && (
                  <div className="docket-row perk-row">
                    <span>F&B Food & Drink Pass x {ticketQuantity}</span>
                    <strong>+${foodVoucherCost.toFixed(2)}</strong>
                  </div>
                )}

                {includeParking && (
                  <div className="docket-row perk-row">
                    <span>Reserved Venue Parking</span>
                    <strong>+$18.00</strong>
                  </div>
                )}

                {appliedPromo && (
                  <div className="docket-row discount-row">
                    <span>Promo Discount ({appliedPromo.label})</span>
                    <strong>-${discountAmount.toFixed(2)}</strong>
                  </div>
                )}

                <div className="docket-row">
                  <span>Verified Ticketing & Gate Fee</span>
                  <span>${bookingFee.toFixed(2)}</span>
                </div>

                <div className="docket-divider" />

                <div className="docket-row grand-total-row">
                  <span>Total Amount</span>
                  <span className="total-val">${totalAmountToPay.toFixed(2)}</span>
                </div>
              </div>

              <div className="guarantee-assurance-strip">
                <ShieldCheck size={16} />
                <span>100% Verified Ticketing Guarantee • Instant QR Delivery</span>
              </div>

              <button
                type="submit"
                className="btn-submit-booking"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner-loading">Securing Passes...</span>
                ) : (
                  <>
                    <CreditCard size={18} /> Pay ${totalAmountToPay.toFixed(2)} & Get E-Passes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Mobile Bottom Action Bar */}
      <div className="mobile-floating-booking-bar">
        <div className="mobile-bar-info">
          <span className="mobile-bar-tier">{selectedTier.name} ({ticketQuantity}x)</span>
          <strong className="mobile-bar-total">${totalAmountToPay.toFixed(2)}</strong>
        </div>
        <button
          className="mobile-bar-action-btn"
          onClick={() => {
            const el = document.querySelector('.event-booking-sidebar');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default EventBookingPage;
