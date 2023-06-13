import React from "react";

import "./BookingList.css";

const BookingList = ({ bookings, onCancelBooking = () => {} }) => {
  return (
    <ul className="booking__list">
      {bookings.map((booking) => (
        <li key={booking._id} className="booking__item">
          <div className="booking__item-data">
            {booking.event.title}-{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="booking__item-action">
            <button
              className="btn"
              onClick={onCancelBooking.bind(this, booking._id)}
            >
              Cancel
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;
