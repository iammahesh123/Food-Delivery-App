import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  updateDiningReservationStatusApi,
  settleDiningBillApi
} from '../../../apiService/api';
import './AdminDining.css';

const AdminDining = () => {
  const [reservations, setReservations] = useState([
    { id: 101, bookingReference: "DIN-8821", restaurantName: "The Olive Gardenia", restaurantId: 1, guestName: "Sarah Jenkins", guestPhone: "+1 (555) 123-4567", bookingDate: "2026-09-11", bookingTime: "19:30", guestCount: 4, mealType: "DINNER", seatingArea: "TERRACE", occasion: "ANNIVERSARY", status: "CONFIRMED", tableNumber: "T-14", billAmount: null, discountPercent: 20 },
    { id: 102, bookingReference: "DIN-8822", restaurantName: "Kyoto Omakase & Robata", restaurantId: 3, guestName: "Michael Chang", guestPhone: "+1 (555) 234-5678", bookingDate: "2026-09-11", bookingTime: "20:00", guestCount: 2, mealType: "DINNER", seatingArea: "SUSHI_BAR", occasion: "DATE_NIGHT", status: "CONFIRMED", tableNumber: "BAR-02", billAmount: null, discountPercent: 25 },
    { id: 103, bookingReference: "DIN-8820", restaurantName: "Artisan Truffle Pizza", restaurantId: 2, guestName: "David Copper", guestPhone: "+1 (555) 345-6789", bookingDate: "2026-09-10", bookingTime: "13:00", guestCount: 3, mealType: "LUNCH", seatingArea: "MAIN_DINING", occasion: "BUSINESS", status: "COMPLETED", tableNumber: "T-05", billAmount: 142.50, discountPercent: 15 },
    { id: 104, bookingReference: "DIN-8819", restaurantName: "Taco Libre Cantina", restaurantId: 4, guestName: "Elena Rostova", guestPhone: "+1 (555) 456-7890", bookingDate: "2026-09-10", bookingTime: "18:45", guestCount: 6, mealType: "DINNER", seatingArea: "COURTYARD", occasion: "BIRTHDAY", status: "CANCELLED", tableNumber: null, billAmount: null, discountPercent: 20 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleStatusChange = async (id, newStatus) => {
    await updateDiningReservationStatusApi(id, newStatus, 'T-AUTO');
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered = reservations.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-dining-page">
      <div className="admin-page-header">
        <div>
          <div className="admin-pre-title">HOSPITALITY & TABLE RESERVATIONS</div>
          <h1 className="admin-main-heading">Platform Dining Management</h1>
          <p className="admin-sub-heading">
            Live cross-restaurant table registry, slot capacity oversight, and dining billing reconciliations.
          </p>
        </div>
      </div>

      <div className="admin-filter-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by reference, guest name, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`filter-pill ${statusFilter === tab ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Reference & Venue</th>
              <th>Guest Details</th>
              <th>Date & Time</th>
              <th>Guests & Area</th>
              <th>Discount</th>
              <th>Status</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table-cell">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>
                      <span className="dining-ref-code">{r.bookingReference}</span>
                      <span className="dining-venue-name">{r.restaurantName}</span>
                    </div>
                  </td>

                  <td>
                    <div className="dining-guest-info">
                      <span className="guest-name-text">{r.guestName}</span>
                      <span className="guest-phone-text">{r.guestPhone}</span>
                    </div>
                  </td>

                  <td>
                    <div className="dining-datetime-stack">
                      <span className="date-val">{r.bookingDate}</span>
                      <span className="time-val"><Clock size={11} /> {r.bookingTime} ({r.mealType})</span>
                    </div>
                  </td>

                  <td>
                    <div className="dining-area-stack">
                      <span className="guests-badge"><Users size={12} /> {r.guestCount} Guests</span>
                      <span className="area-label">{r.seatingArea.replace(/_/g, ' ')}</span>
                    </div>
                  </td>

                  <td>
                    <span className="dining-discount-pill">
                      {r.discountPercent}% OFF
                    </span>
                  </td>

                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className={`status-select-badge status-${r.status.toLowerCase()}`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>

                  <td className="td-actions">
                    <button
                      type="button"
                      className="dining-quick-btn"
                      onClick={() => handleStatusChange(r.id, r.status === 'CONFIRMED' ? 'COMPLETED' : 'CONFIRMED')}
                    >
                      {r.status === 'CONFIRMED' ? 'Mark Completed' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDining;
