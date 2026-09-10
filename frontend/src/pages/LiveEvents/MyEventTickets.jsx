import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { 
  Ticket, Calendar, MapPin, Clock, QrCode, CheckCircle2, 
  XCircle, AlertCircle, ArrowLeft, Download, UtensilsCrossed,
  Sparkles, ExternalLink
} from 'lucide-react';
import './MyEventTickets.css';

const MyEventTickets = () => {
  const navigate = useNavigate();
  const { eventTickets, cancelEventTicket } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const upcomingTickets = eventTickets.filter(
    (t) => t.status === 'CONFIRMED' || t.status === 'CHECKED_IN'
  );
  const pastTickets = eventTickets.filter(
    (t) => t.status === 'CANCELLED' || t.status === 'COMPLETED'
  );

  const displayedTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  const handleCancel = (ticketId, eventName) => {
    if (window.confirm(`Are you sure you want to cancel your ticket for "${eventName}"? Your refund will be processed within 3-5 business days.`)) {
      setCancellingId(ticketId);
      setTimeout(() => {
        cancelEventTicket(ticketId);
        setCancellingId(null);
        if (selectedTicket?.ticketId === ticketId) {
          setSelectedTicket(null);
        }
      }, 500);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="badge-confirmed">
            <CheckCircle2 size={13} /> Confirmed Pass
          </span>
        );
      case 'CHECKED_IN':
        return (
          <span className="badge-checked-in">
            <CheckCircle2 size={13} /> Checked In
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge-cancelled">
            <XCircle size={13} /> Cancelled
          </span>
        );
      default:
        return <span className="badge-default">{status}</span>;
    }
  };

  return (
    <div className="my-tickets-page">
      <div className="tickets-container">
        {/* Header */}
        <div className="tickets-page-header">
          <div>
            <button className="back-btn" onClick={() => navigate('/events')}>
              <ArrowLeft size={16} /> Explore More Events
            </button>
            <h1 className="tickets-title">
              My Event <span className="highlight-text">Tickets & Passes</span>
            </h1>
            <p className="tickets-subtitle">
              Access your digital entry passes, QR codes for gate scanning, and food vouchers.
            </p>
          </div>

          <button 
            className="browse-events-btn"
            onClick={() => navigate('/events')}
          >
            <Sparkles size={16} /> Discover Events
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tickets-tab-bar">
          <button
            className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Ticket size={16} />
            Upcoming Passes ({upcomingTickets.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <Clock size={16} />
            Past / Cancelled ({pastTickets.length})
          </button>
        </div>

        {/* Tickets Grid / List */}
        {displayedTickets.length === 0 ? (
          <div className="tickets-empty-state">
            <div className="empty-icon-box">
              <Ticket size={48} />
            </div>
            <h3>No {activeTab} passes found</h3>
            <p>
              {activeTab === 'upcoming'
                ? "You haven't booked any upcoming live concerts, comedy gigs, or festivals yet."
                : "No past ticket history to show."}
            </p>
            {activeTab === 'upcoming' && (
              <button 
                className="btn-discover"
                onClick={() => navigate('/events')}
              >
                Browse Upcoming Live Events
              </button>
            )}
          </div>
        ) : (
          <div className="tickets-list">
            {displayedTickets.map((ticket) => (
              <div key={ticket.ticketId} className="ticket-card-item">
                {/* Left Poster / Thumbnail */}
                <div className="ticket-thumbnail">
                  <img
                    src={
                      ticket.eventPosterUrl ||
                      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={ticket.eventName}
                  />
                  <span className="ticket-tier-tag">{ticket.ticketTier}</span>
                </div>

                {/* Middle Content */}
                <div className="ticket-info">
                  <div className="ticket-status-row">
                    {getStatusBadge(ticket.status)}
                    <span className="booking-ref-code">REF #{ticket.ticketId}</span>
                  </div>

                  <h3 className="ticket-event-name">{ticket.eventName}</h3>

                  <div className="ticket-meta-grid">
                    <div className="meta-col">
                      <span className="meta-label">Date & Time</span>
                      <span className="meta-value">
                        <Calendar size={14} /> {ticket.eventDate} • {ticket.eventTime}
                      </span>
                    </div>

                    <div className="meta-col">
                      <span className="meta-label">Venue</span>
                      <span className="meta-value">
                        <MapPin size={14} /> {ticket.venueName}
                      </span>
                    </div>

                    <div className="meta-col">
                      <span className="meta-label">Quantity & Amount</span>
                      <span className="meta-value">
                        <Ticket size={14} /> {ticket.quantity} Ticket(s) (₹{ticket.totalAmount})
                      </span>
                    </div>

                    {ticket.foodVoucherIncluded && (
                      <div className="meta-col voucher-col">
                        <span className="meta-label">Addon Benefit</span>
                        <span className="meta-value food-perk">
                          <UtensilsCrossed size={14} /> ₹250 Food Voucher Included
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action & QR snippet */}
                <div className="ticket-side-actions">
                  <div 
                    className="qr-snippet-wrapper"
                    onClick={() => setSelectedTicket(ticket)}
                    title="Click to expand Entry Pass"
                  >
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=GATE-TICKET-${ticket.ticketId}`} 
                      alt="QR Preview"
                    />
                    <span className="tap-view-text">Tap to View Pass</span>
                  </div>

                  <div className="ticket-buttons-group">
                    <button
                      className="btn-view-pass"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <QrCode size={15} /> Show Gate Pass
                    </button>

                    {ticket.status === 'CONFIRMED' && (
                      <button
                        className="btn-cancel-ticket"
                        onClick={() => handleCancel(ticket.ticketId, ticket.eventName)}
                        disabled={cancellingId === ticket.ticketId}
                      >
                        {cancellingId === ticket.ticketId ? 'Cancelling...' : 'Cancel Ticket'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Digital Entry Pass Modal */}
      {selectedTicket && (
        <div className="pass-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="pass-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              className="pass-modal-close" 
              onClick={() => setSelectedTicket(null)}
            >
              ✕
            </button>

            <div className="pass-modal-header">
              <div className="header-tag">OFFICIAL GATE ENTRY PASS</div>
              <h2>{selectedTicket.eventName}</h2>
              <p>{selectedTicket.venueName}</p>
            </div>

            <div className="pass-modal-body">
              <div className="pass-qr-container">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GATE-TICKET-${selectedTicket.ticketId}`}
                  alt="Full QR Pass"
                />
                <div className="qr-ticket-code">{selectedTicket.ticketId}</div>
                <p className="qr-scan-instruction">
                  Scan this QR code at the turnstile or box office counter for entry.
                </p>
              </div>

              <div className="pass-details-table">
                <div className="table-row">
                  <span>Guest Name</span>
                  <strong>{selectedTicket.userName || 'Valued Guest'}</strong>
                </div>
                <div className="table-row">
                  <span>Category & Tier</span>
                  <strong className="text-pink">{selectedTicket.ticketTier} Pass</strong>
                </div>
                <div className="table-row">
                  <span>Attendees</span>
                  <strong>{selectedTicket.quantity} Person(s)</strong>
                </div>
                <div className="table-row">
                  <span>Date & Schedule</span>
                  <strong>{selectedTicket.eventDate} at {selectedTicket.eventTime}</strong>
                </div>
                <div className="table-row">
                  <span>Amount Paid</span>
                  <strong>₹{selectedTicket.totalAmount} (Paid via Digital)</strong>
                </div>
                {selectedTicket.foodVoucherIncluded && (
                  <div className="table-row perk-row">
                    <span>F&B Voucher</span>
                    <strong className="text-emerald">Active ₹250 Counter Credit</strong>
                  </div>
                )}
                <div className="table-row">
                  <span>Pass Status</span>
                  <span>{getStatusBadge(selectedTicket.status)}</span>
                </div>
              </div>

              <div className="gate-notice-box">
                <AlertCircle size={16} />
                <span>
                  Please carry a valid government photo ID matching the booking name. Gates open 60 minutes prior to showtime.
                </span>
              </div>
            </div>

            <div className="pass-modal-footer">
              <button 
                className="btn-print"
                onClick={() => window.print()}
              >
                <Download size={15} /> Save / Print Pass
              </button>
              <button 
                className="btn-done"
                onClick={() => setSelectedTicket(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventTickets;
