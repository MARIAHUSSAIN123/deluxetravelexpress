import React, {
  useEffect,
  useState,
} from "react";

import "./AdminDashboard.css";

import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase";

import emailjs from "@emailjs/browser";

// EMAILJS
const EMAILJS_SERVICE_ID =
  "service_w54sho2";

const EMAILJS_USER_TEMPLATE =
  "template_w8jlcvg";

const EMAILJS_PUBLIC_KEY =
  "Q2aYrQi8_-EbYY6kQ";

const AdminDashboard = () => {

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [usersCount, setUsersCount] =
    useState(0);

  const [tripsCount, setTripsCount] =
    useState(0);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  useEffect(() => {

    const fetchDashboardData =
      async () => {

        try {

          // BOOKINGS
          const bookingsQuery =
            query(
              collection(
                db,
                "bookings"
              ),
              orderBy(
                "createdAt",
                "desc"
              )
            );

          const bookingsSnapshot =
            await getDocs(
              bookingsQuery
            );

          const bookingsData =
            bookingsSnapshot.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              })
            );

          setBookings(
            bookingsData
          );

          // USERS
          const usersSnapshot =
            await getDocs(
              collection(
                db,
                "users"
              )
            );

          setUsersCount(
            usersSnapshot.size
          );

          // TRIPS
          const tripsSnapshot =
            await getDocs(
              collection(
                db,
                "trips"
              )
            );

          setTripsCount(
            tripsSnapshot.size
          );

          // REVENUE
          const revenue =
            bookingsData.reduce(
              (
                total,
                booking
              ) =>
                total +
                Number(
                  booking.totalPrice ||
                    0
                ),
              0
            );

          setTotalRevenue(
            revenue
          );

        } catch (error) {

          console.log(
            "FETCH ERROR:",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchDashboardData();

  }, []);
 const resetAllSeats =
  async () => {

    try {

      const tripsSnapshot =
        await getDocs(
          collection(
            db,
            "trips"
          )
        );

      // FIREBASE UPDATE
      const promises =
        tripsSnapshot.docs.map(
          (tripDoc) => {

            return updateDoc(
              doc(
                db,
                "trips",
                tripDoc.id
              ),
              {
                availableSeats: 5,
              }
            );

          }
        );

      await Promise.all(
        promises
      );

      // UI UPDATE
      const updatedBookings =
        bookings.map(
          (booking) => ({
            ...booking,
            availableSeats: 5,
          })
        );

      setBookings(
        updatedBookings
      );

      alert(
        "All seats reset to 5"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Reset failed"
      );

    }
  };

  // UPDATE STATUS
  const updateBookingStatus =
    async (
      booking,
      status
    ) => {

      try {

        // FIREBASE DOC REF
        const bookingRef =
          doc(
            db,
            "bookings",
            booking.id
          );

        // FIREBASE UPDATE
        await updateDoc(
          bookingRef,
          {
            status: status,
          }
        );

        // EMAIL DATA
       const emailData = {

  passenger_name:
    booking.passengerName,

  passenger_email:
    booking.email,

  from:
    booking.from,

  to:
    booking.to,

  departure:
    booking.departure,

  arrival:
    booking.arrival,

  passengers:
    booking.passengers,

    email: 
    booking.email,
    to_email: booking.email,

  total_price:
    booking.totalPrice,

  status:
    status,
};

        console.log(
          "EMAIL DATA:",
          emailData
        );

        // SEND EMAIL
        const response =
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_USER_TEMPLATE,
            emailData,
            EMAILJS_PUBLIC_KEY
          );

        console.log(
          "EMAIL SUCCESS:",
          response
        );

        // UPDATE UI
        const updatedBookings =
          bookings.map(
            (item) => {

              if (
                item.id ===
                booking.id
              ) {

                return {
                  ...item,
                  status: status,
                };
              }

              return item;
            }
          );

        setBookings(
          updatedBookings
        );

        alert(
          `Booking ${status}`
        );

      } catch (error) {

        console.log(
          "FULL ERROR:",
          error
        );

        alert(
          error.message
        );

      }
    };

  // LOADING
  if (loading) {

    return (
      <div className="loading-text">
        Loading Dashboard...
      </div>
    );

  }

  return (
    <div className="admin-bookings-page">

      <h1 className="admin-bookings-title">
        Admin Dashboard
      </h1>
      <button
  className="reset-btn"
  onClick={resetAllSeats}
>
  Reset All Seats
</button>

      {/* STATS */}
      <div className="dashboard-stats">

        <div className="stat-card">

          <h3>
            Total Bookings
          </h3>

          <p>
            {bookings.length}
          </p>

        </div>

        <div className="stat-card">

          <h3>
            Total Users
          </h3>

          <p>
            {usersCount}
          </p>

        </div>

        <div className="stat-card">

          <h3>
            Total Trips
          </h3>

          <p>
            {tripsCount}
          </p>

        </div>

        <div className="stat-card">

          <h3>
            Total Revenue
          </h3>

          <p>
            $
            {totalRevenue}
          </p>

        </div>

      </div>

      {/* BOOKINGS */}
      {bookings.length === 0 ? (

        <div className="no-bookings">
          No bookings found
        </div>

      ) : (

        <div className="admin-bookings-grid">

          {bookings.map(
            (booking) => (

              <div
                className="booking-card"
                key={booking.id}
              >

                {/* STATUS */}
                <div
                  className={`status-badge ${
                    booking.status ===
                    "approved"
                      ? "status-approved"
                      : booking.status ===
                        "rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >

                  {booking.status ||
                    "pending"}

                </div>

                <h2 className="booking-route">

                  {booking.from}
                  {" → "}
                  {booking.to}

                </h2>

                <div className="booking-info">

                  <p>
                    Name:
                    <span>
                      {
                        booking.passengerName
                      }
                    </span>
                  </p>

                  <p>
                    Email:
                    <span>
                      {
                        booking.email
                      }
                    </span>
                  </p>

                  <p>
                    Phone:
                    <span>
                      {
                        booking.phone
                      }
                    </span>
                  </p>

                  <p>
                    Passengers:
                    <span>
                      {
                        booking.passengers
                      }
                    </span>
                  </p>

                  <p>
                    Payment:
                    <span>
                      {
                        booking.paymentMethod
                      }
                    </span>
                  </p>

                  <p>
                    Seats Left:
                    <span>
                      {
                        booking.availableSeats ??
                        "N/A"
                      }
                    </span>
                  </p>

                </div>

                <div className="booking-price">

                  $
                  {
                    booking.totalPrice
                  }
                  {" "}CAD

                </div>

                {/* ACTIONS */}
                <div className="booking-actions">

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateBookingStatus(
                        booking,
                        "approved"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateBookingStatus(
                        booking,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      )}

    </div>
  );
};

export default AdminDashboard;