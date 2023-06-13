import React from "react";

import "./BookingsControls.css";

const BookingsControls = ({ activeTab, onChange }) => {
  return (
    <div className="bookings-control">
      <button
        className={activeTab === "list" ? "active" : ""}
        onClick={onChange.bind(this, "list")}
      >
        List
      </button>
      <button
        className={activeTab === "chart" ? "active" : ""}
        onClick={onChange.bind(this, "chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
