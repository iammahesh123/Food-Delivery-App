import React, { useState, useContext } from 'react';
import { StoreContext } from '../../../context/StoreContext';
import { 
  CalendarCheck, 
  Users, 
  Clock, 
  MapPin, 
  Search, 
  CheckCircle2, 
  XCircle, 
  UtensilsCrossed, 
  AlertCircle, 
  Tag, 
  Filter, 
  Sparkles,
  Phone,
  Mail,
  Edit3
} from 'lucide-react';
import Button from '../../ui/Button';
import './MerchantDiningManager.css';

const MerchantDiningManager = () => {
  const { 
    diningReservations, 
    updateDiningReservationStatus, 
    cancelDiningReservation 
  } = useContext(StoreContext);

  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED'
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'TODAY' | 'UPCOMING'
  const [editingTableId, setEditingTableId] = useState(null);
  const [tableInput, setTableInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredReservations = diningReservations.filter((res) => {
    // Status
    if (statusFilter !== 'ALL' && res.status !== statusFilter) return false;

    // Date
    if (dateFilter === 'TODAY' && res.date !== todayStr) return false;
    if (dateFilter === 'UPCOMING' && res.date < todayStr) return false;

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = res.guestName?.toLowerCase().includes(q);
      const matchPhone = res.guestPhone?.toLowerCase().includes(q);
      const matchRef = res.bookingReference?.toLowerCase().includes(q);
      const matchVenue = res.restaurantName?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRef && !matchVenue) return false;
    }

    return true;
  });

  // KPI Metrics
  const todayCount = diningReservations.filter(r => r.date === todayStr).length;
  const seatedCount = diningReservations.filter(r => r.status === 'SEATED').length;
  const confirmedCount = diningReservations.filter(r => r.status === 'CONFIRMED').length;
  const totalCoversToday = diningReservations
    .filter(r => r.date === todayStr && r.status !== 'CANCELLED')
    .reduce((sum, r) => sum + (Number(r.guestCount) || 2), 0);

  const handleSeatGuest = (id) => {
    updateDiningReservationStatus(id, 'SEATED');
  };

  const handleCompleteDining = (id) => {
    updateDiningReservationStatus(id, 'COMPLETED');
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Cancel this table reservation?')) {
      cancelDiningReservation(id);
    }
  };

  const startEditTable = (res) => {
    setEditingTableId(res.id);
    setTableInput(res.tableNumber || '');
  };

  const saveTableNumber = (id) => {
    updateDiningReservationStatus(id, undefined, tableInput.trim());
    setEditingTableId(null);
  };

  return (
    <div className="merchant-dining-manager fade-in">
      {/* Top Header */}
      <div className="manager-header">
        <div>
          <span className="manager-eyebrow">
            <CalendarCheck size={14} /> Table Operations & Floor Management
          </span>
          <h1 className="manager-title">Dining Reservations Schedule</h1>
          <p className="manager-sub">
            Monitor incoming guest bookings, assign seating tables, and manage guest cover capacity in real-time.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="manager-kpi-grid">
        <div className="kpi-metric-box">
          <div className="kpi-metric-header">
            <span>Today's Bookings</span>
            <span className="kpi-badge orange">Today</span>
          </div>
          <strong className="kpi-number">{todayCount}</strong>
          <span className="kpi-hint">{totalCoversToday} Total covers expected</span>
        </div>

        <div className="kpi-metric-box">
          <div className="kpi-metric-header">
            <span>Currently Seated</span>
            <span className="kpi-badge blue">In Venue</span>
          </div>
          <strong className="kpi-number">{seatedCount}</strong>
          <span className="kpi-hint">Guests dining right now</span>
        </div>

        <div className="kpi-metric-box">
          <div className="kpi-metric-header">
            <span>Pending Arrival</span>
            <span className="kpi-badge emerald">Confirmed</span>
          </div>
          <strong className="kpi-number">{confirmedCount}</strong>
          <span className="kpi-hint">Arrivals scheduled</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="manager-toolbar">
        <div className="toolbar-search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by guest name, phone, ref, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="toolbar-search-input"
          />
        </div>

        <div className="toolbar-filters-row">
          <div className="filter-group">
            <span className="filter-label">Date:</span>
            <button
              type="button"
              className={`filter-btn ${dateFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setDateFilter('ALL')}
            >
              All Dates
            </button>
            <button
              type="button"
              className={`filter-btn ${dateFilter === 'TODAY' ? 'active' : ''}`}
              onClick={() => setDateFilter('TODAY')}
            >
              Today
            </button>
            <button
              type="button"
              className={`filter-btn ${dateFilter === 'UPCOMING' ? 'active' : ''}`}
              onClick={() => setDateFilter('UPCOMING')}
            >
              Upcoming
            </button>
          </div>

          <div className="filter-group">
            <span className="filter-label">Status:</span>
            {['ALL', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                type="button"
                key={st}
                className={`filter-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="reservations-table-container">
        {filteredReservations.length === 0 ? (
          <div className="empty-table-state">
            <UtensilsCrossed size={36} className="empty-icon" />
            <h3>No Reservations Match Filter</h3>
            <p>Try adjusting your search criteria or status filters.</p>
          </div>
        ) : (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Booking Ref & Venue</th>
                <th>Guest Details</th>
                <th>Schedule</th>
                <th>Party & Zone</th>
                <th>Assigned Table</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => {
                const isConfirmed = res.status === 'CONFIRMED';
                const isSeated = res.status === 'SEATED';
                const isCompleted = res.status === 'COMPLETED';
                const isCancelled = res.status === 'CANCELLED';

                return (
                  <tr key={res.id} className={`table-row ${res.status.toLowerCase()}`}>
                    {/* Ref & Venue */}
                    <td>
                      <span className="ref-pill">{res.bookingReference}</span>
                      <strong className="venue-title">{res.restaurantName}</strong>
                      <span className="occasion-tag">{res.occasion?.replace(/_/g, ' ')}</span>
                    </td>

                    {/* Guest Contact */}
                    <td>
                      <strong className="guest-name">{res.guestName}</strong>
                      <div className="contact-subline">
                        <Phone size={12} /> <span>{res.guestPhone}</span>
                      </div>
                      {res.guestEmail && (
                        <div className="contact-subline">
                          <Mail size={12} /> <span>{res.guestEmail}</span>
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td>
                      <div className="schedule-cell">
                        <strong className="time-val">{res.time}</strong>
                        <span className="date-val">{res.date}</span>
                        <span className="meal-tag">{res.mealType}</span>
                      </div>
                    </td>

                    {/* Party & Zone */}
                    <td>
                      <div className="party-cell">
                        <span className="covers-count">
                          <Users size={14} /> {res.guestCount} Covers
                        </span>
                        <span className="zone-label">{res.seatingArea?.replace(/_/g, ' ')}</span>
                        {res.specialRequests && (
                          <span className="special-badge" title={res.specialRequests}>
                            ★ "{res.specialRequests}"
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Table Assignment */}
                    <td>
                      {editingTableId === res.id ? (
                        <div className="edit-table-inline">
                          <input
                            type="text"
                            value={tableInput}
                            onChange={(e) => setTableInput(e.target.value)}
                            placeholder="e.g. T-12"
                            className="inline-table-input"
                            autoFocus
                          />
                          <button
                            type="button"
                            className="save-table-btn"
                            onClick={() => saveTableNumber(res.id)}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="table-display-pill" onClick={() => startEditTable(res)}>
                          <span>{res.tableNumber ? `Table ${res.tableNumber}` : 'Assign Table'}</span>
                          <Edit3 size={12} className="edit-icon" />
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-tag ${res.status.toLowerCase()}`}>
                        {res.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="row-actions-group">
                        {isConfirmed && (
                          <>
                            <button
                              type="button"
                              className="action-btn seat"
                              onClick={() => handleSeatGuest(res.id)}
                              title="Mark guest as seated"
                            >
                              Seat Guests
                            </button>
                            <button
                              type="button"
                              className="action-btn cancel"
                              onClick={() => handleCancelBooking(res.id)}
                              title="Cancel booking"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {isSeated && (
                          <button
                            type="button"
                            className="action-btn complete"
                            onClick={() => handleCompleteDining(res.id)}
                            title="Complete and clear table"
                          >
                            Complete & Clear
                          </button>
                        )}

                        {isCompleted && (
                          <span className="completed-label">✓ Completed</span>
                        )}

                        {isCancelled && (
                          <span className="cancelled-label">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MerchantDiningManager;
