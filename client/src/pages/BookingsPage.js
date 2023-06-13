import React, { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner";
import BookingList from "../components/Bookings/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const { token } = useContext(AuthContext);

  const cancelBookingHandler = async (bookingId) => {
    setIsLoading(true);
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
            creator {
              email
            }
          }
        }
      `,
      variables: {
        id: bookingId,
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
      console.log("TCL -> cancelBookingHandler -> resData:", resData);
      setIsLoading(false);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (err) {
      setIsLoading(false);
      console.log("TCL -> fetchBookings -> err:", err);
    }
  };
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            updatedAt
            event {
              _id
              title
              description
              price
              date
            }
            user {
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
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!");
      }
      const resData = await res.json();
      setIsLoading(false);
      setBookings([...resData.data.bookings]);
    } catch (err) {
      setIsLoading(false);
      console.log("TCL -> fetchBookings -> err:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const changeActiveTabHandler = (tab) => {
    if (tab === "list") {
      setActiveTab("list");
    } else {
      setActiveTab("chart");
    }
  };
  let content = <Spinner />;
  if (!isLoading) {
    content = (
      <>
        <BookingsControls
          activeTab={activeTab}
          onChange={changeActiveTabHandler}
        />
        <div>
          {activeTab === "list" ? (
            <BookingList
              bookings={bookings}
              onCancelBooking={cancelBookingHandler}
            />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </>
    );
  }
  return <>{content}</>;
};

export default BookingsPage;
