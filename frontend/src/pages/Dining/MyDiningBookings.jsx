import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  UtensilsCrossed, 
  X, 
  Receipt, 
  CreditCard, 
  ArrowRight,
  ChevronRight,
  PhoneCall,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import DiningPayModal from '../../components/Dining/DiningPayModal';
import './MyDiningBookings.css';

const MyDiningBookings = () => {
  const navigate = useNavigate();
  const { 
    diningReservations, 
    cancelDiningReservation, 
    payDiningBill 
  } = useContext(StoreContext);

  const [activeTab, setActiveTab] = useState('UPCOMING'); // 'UPCOMING' | 'PAST'
  const [selectedQrPass, setSelectedQrPass] = useState(null);
  const [payingReservation, setPayingReservation] = useState(null);

  // Group reservations
  const upcomingList = diningReservations.filter(
    (r) => r.status === 'CONFIRMED' || r.status === 'SEATED'
  );
  const pastList = diningReservations.filter(
    (r) => r.status === 'COMPLETED' || r.status === 'CANCELLED'
  );

  const displayedList = activeTab === 'UPCOMING' ? upcomingList : pastList;

  // Aggregate stats
  const totalCompleted = diningReservations.filter((r) => r.status === 'COMPLETED').length;
  const totalSaved = diningReservations.reduce((acc, r) => {
    if (r.status === 'COMPLETED' && r.discountApplied) {
      return acc + r.discountApplied;
    }
    return acc + (r.status === 'COMPLETED' ? 24 : 0);
  }, 0);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this table reservation? Zero fee applies.')) {
      cancelDiningReservation(id);
    }
  };

  return (
    <div className="my-dining-page fade-in">
      {/* Top Banner */}
      <div className="my-dining-header">
        <div className="header-text-block">
          <span className="dining-pill-badge">
            <UtensilsCrossed size={14} /> My Dining Passes & History
          </span>
          <h1 className="dining-page-title">Table Reservations</h1>
          <p className="dining-page-sub">
            Manage your digital dining passes, host check-in QR codes, and in-venue bill payments.
          </p>
        </div>

        <Link to="/dining" className="browse-more-btn">
          Explore Dining Venues <ArrowRight size={16} />
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="dining-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <CalendarCheck size={20} />
          </div>
          <div>
            <span className="kpi-label">Upcoming Tables</span>
            <strong className="kpi-value">{upcomingList.length} Active</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="kpi-label">Dining Visits</span>
            <strong className="kpi-value">{totalCompleted} Visited</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap orange">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="kpi-label">Total Perks Saved</span>
            <strong className="kpi-value text-emerald">${totalSaved.toFixed(0)} Saved</strong>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="reservations-tabs-bar">
        <button
          type="button"
          className={`tab-item-btn ${activeTab === 'UPCOMING' ? 'active' : ''}`}
          onClick={() => setActiveTab('UPCOMING')}
        >
          Upcoming & Active ({upcomingList.length})
        </button>
        <button
          type="button"
          className={`tab-item-btn ${activeTab === 'PAST' ? 'active' : ''}`}
          onClick={() => setActiveTab('PAST')}
        >
          Past Experiences ({pastList.length})
        </button>
      </div>

      {/* Reservations List */}
      {displayedList.length === 0 ? (
        <div className="empty-reservations-box">
          <div className="empty-icon-wrap">
            <UtensilsCrossed size={36} />
          </div>
          <h3>No {activeTab === 'UPCOMING' ? 'Upcoming' : 'Past'} Reservations Found</h3>
          <p>
            {activeTab === 'UPCOMING'
              ? "You haven't reserved any tables yet. Discover rooftop lounges, romantic bistros, and artisanal kitchens!"
              : 'Your past completed and cancelled dining reservations will appear here.'}
          </p>
          <Button variant="primary" onClick={() => navigate('/dining')}>
            Browse Dining Venues
          </Button>
        </div>
      ) : (
        <div className="reservations-list-grid">
          {displayedList.map((res) => {
            const isConfirmed = res.status === 'CONFIRMED';
            const isSeated = res.status === 'SEATED';
            const isCompleted = res.status === 'COMPLETED';
            const isCancelled = res.status === 'CANCELLED';

            return (
              <div key={res.id} className="reservation-card-box">
                {/* Image & Quick Info */}
                <div className="res-cover-column">
                  <img
                    src={res.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop'}
                    alt={res.restaurantName}
                    className="res-cover-img"
                  />
                  <div className="res-overlay-status">
                    <span className={`status-badge ${res.status.toLowerCase()}`}>
                      {res.status}
                    </span>
                  </div>
                </div>

                {/* Main Details */}
                <div className="res-info-column">
                  <div className="res-header-line">
                    <div>
                      <span className="res-ref-label">Pass Reference: {res.bookingReference}</span>
                      <h2 className="res-venue-title">{res.restaurantName}</h2>
                      <span className="res-venue-address"><MapPin size={13} /> {res.restaurantAddress}</span>
                    </div>

                    {/* QR Code Quick Icon */}
                    {(isConfirmed || isSeated) && (
                      <button
                        type="button"
                        className="qr-quick-btn"
                        onClick={() => setSelectedQrPass(res)}
                        title="Show Digital QR Pass"
                      >
                        <QrCode size={26} />
                        <span>Show QR Pass</span>
                      </button>
                    )}
                  </div>

                  {/* Booking Docket Attributes */}
                  <div className="res-docket-strip">
                    <div className="docket-chip">
                      <Calendar size={14} />
                      <span>{res.date}</span>
                    </div>
                    <div className="docket-chip">
                      <Clock size={14} />
                      <span>{res.time} ({res.mealType})</span>
                    </div>
                    <div className="docket-chip">
                      <Users size={14} />
                      <span>{res.guestCount} {res.guestCount === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="docket-chip">
                      <UtensilsCrossed size={14} />
                      <span>{res.seatingArea?.replace(/_/g, ' ')}</span>
                    </div>
                    {res.tableNumber && (
                      <div className="docket-chip highlight">
                        <span>Assigned Table: {res.tableNumber}</span>
                      </div>
                    )}
                  </div>

                  {res.specialRequests && (
                    <div className="res-special-request">
                      <strong>Special Request:</strong> "{res.specialRequests}"
                    </div>
                  )}

                  {/* Settled Bill Docket (If Completed) */}
                  {isCompleted && res.billAmount && (
                    <div className="res-bill-settled-strip">
                      <Receipt size={16} className="text-emerald" />
                      <span>
                        Table Bill Paid: <strong>${res.billAmount.toFixed(2)}</strong> via Tomato Pay
                        {res.discountApplied && ` (Saved $${res.discountApplied.toFixed(2)})`}
                      </span>
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  <div className="res-actions-footer">
                    {(isConfirmed || isSeated) && (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => setPayingReservation(res)}
                          className="pay-bill-cta"
                        >
                          <CreditCard size={15} /> Pay Dining Bill ({res.discountPercent}% Off)
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedQrPass(res)}
                        >
                          <QrCode size={15} /> Host QR Pass
                        </Button>
                        <button
                          type="button"
                          className="cancel-link-btn"
                          onClick={() => handleCancel(res.id)}
                        >
                          Cancel Reservation
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/dining/book/${res.restaurantId}`)}
                      >
                        Book Table Again
                      </Button>
                    )}

                    {isCancelled && (
                      <div className="cancelled-note">
                        <AlertCircle size={14} />
                        <span>This reservation was cancelled. Zero cancellation fee charged.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Pass Fullscreen Modal */}
      {selectedQrPass && (
        <div className="dining-modal-backdrop fade-in" onClick={() => setSelectedQrPass(null)}>
          <div className="qr-pass-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-modal-btn"
              onClick={() => setSelectedQrPass(null)}
            >
              <X size={20} />
            </button>

            <div className="qr-modal-header">
              <span className="qr-pass-tag">Digital Table Check-In Pass</span>
              <h2 className="qr-venue-name">{selectedQrPass.restaurantName}</h2>
              <p className="qr-venue-addr"><MapPin size={13} /> {selectedQrPass.restaurantAddress}</p>
            </div>

            <div className="qr-code-display-card">
              <QrCode size={160} className="large-qr-code" />
              <div className="verification-code-badge">
                <span className="code-label">Booking Reference</span>
                <span className="code-text">{selectedQrPass.bookingReference}</span>
              </div>
              <p className="scan-instruction">Please present this QR screen to the restaurant host desk.</p>
            </div>

            <div className="qr-pass-details-list">
              <div className="pass-detail-row">
                <span>Reservation Date:</span>
                <strong>{selectedQrPass.date} at {selectedQrPass.time}</strong>
              </div>
              <div className="pass-detail-row">
                <span>Party Size:</span>
                <strong>{selectedQrPass.guestCount} Guests</strong>
              </div>
              <div className="pass-detail-row">
                <span>Seating Area:</span>
                <strong>{selectedQrPass.seatingArea?.replace(/_/g, ' ')}</strong>
              </div>
              <div className="pass-detail-row">
                <span>Guest Name:</span>
                <strong>{selectedQrPass.guestName}</strong>
              </div>
            </div>

            <div className="qr-modal-actions">
              <Button variant="primary" onClick={() => setSelectedQrPass(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dining Bill Pay Modal */}
      {payingReservation && (
        <DiningPayModal
          reservation={payingReservation}
          onClose={() => setPayingReservation(null)}
          onPaymentSuccess={payDiningBill}
        />
      )}
    </div>
  );
};

export default MyDiningBookings;
