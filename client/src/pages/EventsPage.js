import React, { useCallback, useContext, useEffect, useState } from "react";

import AuthContext from "../context/auth-context";
import Backdrop from "../components/Backdrop";
import EventList from "../components/Events/EventList";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

import "./EventsPage.css";

const INITIAL_MODAL_STATE = { open: false };
const INITIAL_EVENT_STATE = { title: "", price: 0, date: "", description: "" };

const EventsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);
  const [event, setEvent] = useState(INITIAL_EVENT_STATE);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { userId, token } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const startCreateEventHandler = () => {
    setModalState((prevState) => ({ ...prevState, open: true }));
  };

  const modalCancelHandler = () => {
    setSelectedEvent(null);
    setEvent(INITIAL_EVENT_STATE);
    setModalState((prevState) => ({ ...prevState, open: false }));
  };

  const modalConfirmHandler = async () => {
    const { title, price: priceValue, date, description } = event;
    const price = +priceValue;
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const requestBody = {
      query: `
        mutation CreateEvent($eventInput: EventInput!) {
          createEvent(eventInput: $eventInput) {
            _id
            title
            description
            price
            date
          }
        }
      `,
      variables: {
        eventInput: { title, description, price, date },
      },
    };

    try {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      setEvents((prevEvents) => [
        ...prevEvents,
        { ...resData.data.createEvent, creator: { _id: userId } },
      ]);
      setEvent(INITIAL_EVENT_STATE);
      setModalState((prevState) => ({ ...prevState, open: false }));
    } catch (err) {
      console.log("TCL -> handleSubmit -> err:", err);
    }
  };

  const showDetailHandler = (eventId) => {
    const event = events.find((event) => {
      return event._id === eventId;
    });
    setSelectedEvent(event);
  };

  const bookEventHandler = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
            event {
              title
              description
            }
            user {
              email
            }
          }
        }
      `,
      variables: {
        id: selectedEvent._id,
      },
    };

    try {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      console.log("TCL -> handleSubmit -> resData:", resData);
      setIsLoading(false);
      setSelectedEvent(null);
    } catch (err) {
      setIsLoading(false);
      console.log("TCL -> handleSubmit -> err:", err);
    }
  };

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    try {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      setIsLoading(false);
      setEvents([...resData.data.events]);
    } catch (err) {
      setIsLoading(false);
      console.log("TCL -> fetchEvents -> err:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      {modalState.open && (
        <>
          <Backdrop />
          <Modal
            title="Add Event"
            canCancel={true}
            canConfirm={true}
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
          >
            <form className="">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={event.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Date</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={event.date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows={4}
                  id="description"
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                />
              </div>
            </form>
          </Modal>
        </>
      )}

      {selectedEvent && (
        <>
          <Backdrop />
          <Modal
            title={selectedEvent.title}
            canCancel={true}
            canConfirm={token}
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText="Book"
          >
            <h1> {selectedEvent.title} </h1>
            <h2>
              ${selectedEvent.price} -
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p> {selectedEvent.description} </p>
          </Modal>
        </>
      )}
      {token && (
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList events={events} onViewDetail={showDetailHandler} />
      )}
    </>
  );
};

export default EventsPage;
