import React, { useState } from 'react';
import './BookTable.css';

const BookTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [mealType, setMealType] = useState('lunch'); // Default to Lunch
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Time slots for Lunch and Dinner
  const timeSlots = {
    lunch: ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
    dinner: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'],
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }
    alert(`Table booked for ${mealType} on ${selectedDate} at ${selectedTime} for ${numberOfGuests} guests.`);
  };

  return (
    <div className="book-table">
      <h2>Book a Table</h2>
      <div className="booking-form">
        {/* Date Picker */}
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Restrict to today and future dates
          />
        </div>

        {/* Meal Type (Lunch or Dinner) */}
        <div className="form-group">
          <label>Meal Type</label>
          <div className="meal-type-buttons">
            <button
              className={mealType === 'lunch' ? 'active' : ''}
              onClick={() => setMealType('lunch')}
            >
              Lunch
            </button>
            <button
              className={mealType === 'dinner' ? 'active' : ''}
              onClick={() => setMealType('dinner')}
            >
              Dinner
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="form-group">
          <label>Select Time</label>
          <div className="time-slots">
            {timeSlots[mealType].map((time, index) => (
              <button
                key={index}
                className={selectedTime === time ? 'active' : ''}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Guests */}
        <div className="form-group">
          <label>Number of Guests</label>
          <input
            type="number"
            min="1"
            max="10"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </div>

        {/* Book Now Button */}
        <button className="book-now-btn" onClick={handleBooking}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookTable;