import React, { useContext } from "react";

import "./EventItem.css";
import AuthContext from "../../../../context/auth-context";

const EventItem = ({ event, onDetail }) => {
  const { userId } = useContext(AuthContext);

  return (
    <li className="event__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {event.creator._id === userId ? (
          <p>You'r the owner of this event.</p>
        ) : (
          <button
            className="btn"
            onClick={onDetail.bind(this, event._id)}
            // onClick={() => {
            //   onDetail(event._id);
            // }}
          >
            View Details{" "}
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
