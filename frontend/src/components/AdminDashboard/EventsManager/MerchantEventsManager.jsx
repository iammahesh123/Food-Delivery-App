import React, { useContext, useState } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { 
  Ticket, Calendar, MapPin, CheckCircle2, Users, Search, 
  Sparkles, DollarSign, Clock, QrCode, Filter, AlertCircle, 
  Check, ArrowRight
} from 'lucide-react';
import Toast from '../../ui/Toast';
import './MerchantEventsManager.css';

const MerchantEventsManager = () => {
  const { liveEvents, eventTickets, checkInEventTicket } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);
  const [manualScanCode, setManualScanCode] = useState('');

  // Stats calculation
  const totalEvents = liveEvents ? liveEvents.length : 0;
  const totalTicketsSold = eventTickets.filter((t) => t.status !== 'CANCELLED').reduce((acc, t) => acc + (t.quantity || 1), 0);
  const totalGrossRevenue = eventTickets.filter((t) => t.status !== 'CANCELLED').reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  const totalCheckedIn = eventTickets.filter((t) => t.status === 'CHECKED_IN').reduce((acc, t) => acc + (t.quantity || 1), 0);

  // Filtered tickets
  const filteredTickets = eventTickets.filter((ticket) => {
    const matchesEvent = selectedEventFilter === 'ALL' || ticket.eventId === selectedEventFilter;
    const matchesSearch = 
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketTier?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const handleGateCheckIn = (ticketId, guestName) => {
    checkInEventTicket(ticketId);
    setToastMessage({
      text: `Gate Entry Approved: ${guestName || 'Guest'} checked in successfully!`,
      type: 'success',
    });
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!manualScanCode.trim()) return;

    // Remove prefixes if scanned via barcode reader (e.g. GATE-TICKET-xxx)
    const cleanId = manualScanCode.replace(/^GATE-TICKET-/, '').trim();
    const foundTicket = eventTickets.find((t) => t.ticketId.toLowerCase() === cleanId.toLowerCase());

    if (!foundTicket) {
      setToastMessage({
        text: `Invalid Pass: No record found for code "${manualScanCode}".`,
        type: 'error',
      });
      return;
    }

    if (foundTicket.status === 'CANCELLED') {
      setToastMessage({
        text: `Entry Denied: This ticket was cancelled and refunded.`,
        type: 'error',
      });
      return;
    }

    if (foundTicket.status === 'CHECKED_IN') {
      setToastMessage({
        text: `Warning: This pass was ALREADY checked in!`,
        type: 'warning',
      });
      return;
    }

    // Success check-in
    checkInEventTicket(foundTicket.ticketId);
    setToastMessage({
      text: `Verified! Pass #${foundTicket.ticketId} (${foundTicket.userName || 'Guest'}) checked in.`,
      type: 'success',
    });
    setManualScanCode('');
  };

  return (
    <div className="merchant-events-page fade-in">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div className="events-mgmt-header">
        <div>
          <h1 className="mgmt-title">Live Events & Gate Scanner</h1>
          <p className="mgmt-subtitle">
            Manage concert capacities, real-time ticket sales, attendee rosters, and box-office turnstile check-ins.
          </p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="mgmt-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap icon-purple">
            <Sparkles size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Events</span>
            <h3 className="kpi-value">{totalEvents}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap icon-blue">
            <Ticket size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Tickets Sold</span>
            <h3 className="kpi-value">{totalTicketsSold}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap icon-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Admitted at Gate</span>
            <h3 className="kpi-value">{totalCheckedIn}</h3>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap icon-pink">
            <DollarSign size={24} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Gross Revenue</span>
            <h3 className="kpi-value">₹{totalGrossRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Fast Gate Turnstile Scanner */}
      <div className="gate-scanner-box">
        <div className="scanner-header">
          <div className="scanner-icon">
            <QrCode size={24} />
          </div>
          <div>
            <h3>Gate Scanner / Rapid Entry Validator</h3>
            <p>Scan barcode reader or type ticket reference code to admit attendees instantly.</p>
          </div>
        </div>

        <form className="scanner-form" onSubmit={handleManualScanSubmit}>
          <div className="scan-input-wrapper">
            <Search size={18} className="scan-icon" />
            <input
              type="text"
              placeholder="Scan or enter Ticket ID (e.g. TKT-101 or GATE-TICKET-xxx)..."
              value={manualScanCode}
              onChange={(e) => setManualScanCode(e.target.value)}
              className="scan-input"
            />
          </div>
          <button type="submit" className="scan-admit-btn">
            <Check size={18} /> Validate & Admit
          </button>
        </form>
      </div>

      {/* Active Events Roster */}
      <div className="events-roster-section">
        <h2 className="section-heading">Featured Events Portfolio</h2>
        <div className="roster-grid">
          {liveEvents.map((evt) => (
            <div key={evt.id} className="roster-card">
              <div className="roster-card-media">
                <img src={evt.posterUrl} alt={evt.title} />
                <span className="roster-cat-chip">{evt.category}</span>
              </div>
              <div className="roster-card-body">
                <h4 className="roster-card-title">{evt.title}</h4>
                <div className="roster-meta-row">
                  <span><Calendar size={13} /> {evt.date} • {evt.time}</span>
                  <span><MapPin size={13} /> {evt.venue}</span>
                </div>
                <div className="roster-footer">
                  <span className="starting-price">Starting ₹{evt.startingPrice}</span>
                  <span className="capacity-badge">
                    <Users size={12} /> {evt.totalCapacity} Cap
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendees & Ticket Roster Table */}
      <div className="attendees-table-card">
        <div className="table-filter-bar">
          <div className="filter-title-group">
            <h2 className="section-heading">Ticket Sales & Gate Roster</h2>
            <span className="roster-count">{filteredTickets.length} Passes</span>
          </div>

          <div className="table-controls">
            <div className="filter-dropdown-wrap">
              <Filter size={15} />
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="event-filter-select"
              >
                <option value="ALL">All Events</option>
                {liveEvents.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-filter-input">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search attendee, pass ID, tier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="table-empty">
            <AlertCircle size={36} />
            <p>No ticket passes match the search or filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="roster-table">
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Attendee</th>
                  <th>Event & Schedule</th>
                  <th>Tier & Qty</th>
                  <th>F&B Voucher</th>
                  <th>Amount</th>
                  <th>Gate Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.ticketId}>
                    <td>
                      <span className="code-badge">{t.ticketId}</span>
                    </td>
                    <td>
                      <div className="attendee-cell">
                        <strong className="attendee-name">{t.userName || 'Valued Guest'}</strong>
                        <span className="attendee-email">{t.userEmail || 'guest@example.com'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="event-cell">
                        <span className="event-name-text">{t.eventName}</span>
                        <span className="event-date-text">{t.eventDate} at {t.eventTime}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tier-chip ${t.ticketTier?.toLowerCase()}`}>
                        {t.ticketTier} ({t.quantity}x)
                      </span>
                    </td>
                    <td>
                      {t.foodVoucherIncluded ? (
                        <span className="voucher-yes">₹250 Included</span>
                      ) : (
                        <span className="voucher-none">—</span>
                      )}
                    </td>
                    <td>
                      <strong className="amount-text">₹{t.totalAmount}</strong>
                    </td>
                    <td>
                      {t.status === 'CONFIRMED' && (
                        <span className="status-pill confirmed">Confirmed</span>
                      )}
                      {t.status === 'CHECKED_IN' && (
                        <span className="status-pill checked-in">
                          <Check size={12} /> Checked In
                        </span>
                      )}
                      {t.status === 'CANCELLED' && (
                        <span className="status-pill cancelled">Cancelled</span>
                      )}
                    </td>
                    <td>
                      {t.status === 'CONFIRMED' ? (
                        <button
                          className="btn-admit"
                          onClick={() => handleGateCheckIn(t.ticketId, t.userName)}
                        >
                          <Check size={14} /> Admit
                        </button>
                      ) : t.status === 'CHECKED_IN' ? (
                        <span className="admitted-label">Admitted</span>
                      ) : (
                        <span className="void-label">Void</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantEventsManager;
