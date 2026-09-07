import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Calendar, Clock, Users, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import Button from '../../components/ui/Button';
import './BookTable.css';

const BookTable = ({ restaurant }) => {
  const { bookTable } = useContext(StoreContext);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState('1:00 PM');
  const [mealType, setMealType] = useState('lunch');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const timeSlots = {
    lunch: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
    dinner: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'],
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const reservation = bookTable({
      restaurantId: restaurant?.id || '1',
      restaurantName: restaurant?.name || 'Delicious Bites',
      date: selectedDate,
      time: selectedTime,
      mealType,
      numberOfGuests,
      specialRequests,
    });
    setBookingConfirmed(reservation);
  };

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmed-card fade-in">
        <div className="confirmed-icon-wrap">
          <CheckCircle2 size={36} />
        </div>
        <h2>Table Reservation Confirmed!</h2>
        <p className="confirmed-subtitle">
          Your table has been reserved at <strong>{restaurant?.name || 'Delicious Bites'}</strong>.
        </p>

        <div className="reservation-details-docket">
          <div className="docket-row">
            <span className="docket-label">Booking Reference</span>
            <span className="docket-val">{bookingConfirmed.id}</span>
          </div>
          <div className="docket-row">
            <span className="docket-label">Date & Time</span>
            <span className="docket-val">{bookingConfirmed.date} at {bookingConfirmed.time}</span>
          </div>
          <div className="docket-row">
            <span className="docket-label">Party Size</span>
            <span className="docket-val">{bookingConfirmed.numberOfGuests} Guests ({bookingConfirmed.mealType})</span>
          </div>
          {bookingConfirmed.specialRequests && (
            <div className="docket-row">
              <span className="docket-label">Special Request</span>
              <span className="docket-val">{bookingConfirmed.specialRequests}</span>
            </div>
          )}
        </div>

        <div className="confirmed-actions">
          <Button variant="secondary" onClick={() => setBookingConfirmed(null)}>
            Book Another Table
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-table">
      <div className="book-table-header">
        <h2 className="section-title">Reserve a Dining Table</h2>
        <p className="section-subtitle">
          Enjoy priority seating, private dining, or patio reservations with instant confirmation.
        </p>
      </div>

      <form onSubmit={handleBooking} className="booking-form-grid">
        {/* Date Selector */}
        <div className="booking-field-group">
          <label className="field-label">
            <Calendar size={16} /> Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="booking-input"
            required
          />
        </div>

        {/* Meal Type */}
        <div className="booking-field-group">
          <label className="field-label">
            <UtensilsCrossed size={16} /> Meal Service
          </label>
          <div className="meal-type-buttons">
            <button
              type="button"
              className={`meal-btn ${mealType === 'lunch' ? 'active' : ''}`}
              onClick={() => {
                setMealType('lunch');
                setSelectedTime('1:00 PM');
              }}
            >
              Lunch (12:00 PM – 2:30 PM)
            </button>
            <button
              type="button"
              className={`meal-btn ${mealType === 'dinner' ? 'active' : ''}`}
              onClick={() => {
                setMealType('dinner');
                setSelectedTime('7:00 PM');
              }}
            >
              Dinner (6:00 PM – 9:30 PM)
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="booking-field-group full-width">
          <label className="field-label">
            <Clock size={16} /> Available Seating Slots
          </label>
          <div className="time-slots-grid">
            {timeSlots[mealType].map((time, index) => (
              <button
                type="button"
                key={index}
                className={`slot-chip ${selectedTime === time ? 'active' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Guests */}
        <div className="booking-field-group">
          <label className="field-label">
            <Users size={16} /> Number of Guests
          </label>
          <div className="guests-stepper">
            <button
              type="button"
              onClick={() => setNumberOfGuests((g) => Math.max(1, g - 1))}
              className="stepper-btn"
            >
              -
            </button>
            <span className="guests-count">{numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
            <button
              type="button"
              onClick={() => setNumberOfGuests((g) => Math.min(12, g + 1))}
              className="stepper-btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Special Requests */}
        <div className="booking-field-group full-width">
          <label className="field-label">Special Requests (Optional)</label>
          <input
            type="text"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Anniversary celebration, window table, high chair for toddler..."
            className="booking-input"
          />
        </div>

        <div className="booking-submit-row full-width">
          <Button type="submit" variant="primary" size="lg" className="confirm-booking-btn">
            Confirm Reservation for {numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookTable;