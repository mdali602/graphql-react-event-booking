import React from "react";

import EventItem from "./EventItem";

import "./EventList.css";

const EventList = ({ events, onViewDetail }) => {
  const listedEvents = events.map((event) => (
    <EventItem key={event._id} event={event} onDetail={onViewDetail} />
  ));
  return <ul className="event__list">{listedEvents}</ul>;
};

export default EventList;
