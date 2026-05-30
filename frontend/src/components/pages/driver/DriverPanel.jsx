import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";

import "./DriverPanel.css";

import emailjs from "@emailjs/browser";

// =========================
// EMAILJS CONFIG
// =========================

const EMAILJS_SERVICE_ID = "service_w54sho2";
const EMAILJS_ADMIN_TEMPLATE = "template_7s50fav"; // admin ko notify
const EMAILJS_PUBLIC_KEY = "Q2aYrQi8_-EbYY6kQ";
const ADMIN_EMAIL = "deluxedrive05@gmail.com";

const DriverPanel = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      const data = snapshot.docs
        .map((docItem) => ({ id: docItem.id, ...docItem.data() }))
        .filter((booking) => booking.status === "approved");
      setBookings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS + NOTIFY ADMIN
  // =========================

  const updateStatus = async (booking, status) => {
    try {

      // UPDATE FIRESTORE
      await updateDoc(doc(db, "bookings", booking.id), {
        travelStatus: status,
      });

      console.log("STATUS UPDATED:", status);

      const departureTime = booking.departure || booking.departureDate;

      // =========================
      // BOARDING → Admin ko notify
      // =========================

      if (status === "boarding") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_ADMIN_TEMPLATE,
          {
            to_email: ADMIN_EMAIL,
            name: booking.passengerName,
            message: `🚏 Boarding has started for ${booking.passengerName} — ${booking.from} → ${booking.to} at ${departureTime}`,
            passenger_name: booking.passengerName,
            email: booking["e-mail"] || booking.email,
            phone: booking.phone || "",
            from: booking.from,
            to: booking.to,
            departure: departureTime,
            passengers: booking.passengers,
            total_price: booking.totalPrice || "",
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("ADMIN NOTIFIED: Boarding started");
      }

      // =========================
      // DEPARTURE → Admin ko notify
      // =========================

      if (status === "departed") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_ADMIN_TEMPLATE,
          {
            to_email: ADMIN_EMAIL,
            name: booking.passengerName,
            message: `🚌 Bus has departed — ${booking.from} → ${booking.to} | Passenger: ${booking.passengerName}`,
            passenger_name: booking.passengerName,
            email: booking["e-mail"] || booking.email,
            phone: booking.phone || "",
            from: booking.from,
            to: booking.to,
            departure: departureTime,
            passengers: booking.passengers,
            total_price: booking.totalPrice || "",
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("ADMIN NOTIFIED: Departed");
      }

      // =========================
      // ARRIVAL → Admin ko notify
      // =========================

      if (status === "arrived") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_ADMIN_TEMPLATE,
          {
            to_email: ADMIN_EMAIL,
            name: booking.passengerName,
            message: `✅ Bus has arrived — ${booking.from} → ${booking.to} | Passenger: ${booking.passengerName}`,
            passenger_name: booking.passengerName,
            email: booking["e-mail"] || booking.email,
            phone: booking.phone || "",
            from: booking.from,
            to: booking.to,
            departure: departureTime,
            passengers: booking.passengers,
            total_price: booking.totalPrice || "",
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("ADMIN NOTIFIED: Arrived");
      }

      fetchBookings();

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "boarding": return "boarding";
      case "departed": return "departed";
      case "arrived": return "arrived";
      default: return "pending";
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="driver-panel">

      <div className="driver-header">
        <h1>Driver Dashboard</h1>
        <p>Notify admin about trip status</p>
      </div>

      {loading ? (
        <div className="driver-loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="driver-empty">No active bookings found</div>
      ) : (
        <div className="driver-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="driver-card">

              {/* TOP */}
              <div className="card-top">
                <div>
                  <h2>{booking.passengerName}</h2>
                  <p className="route">{booking.from} → {booking.to}</p>
                </div>
                <span className={`status-badge ${getStatusClass(booking.travelStatus)}`}>
                  {booking.travelStatus || "pending"}
                </span>
              </div>

              {/* INFO */}
              <div className="trip-info">
                <div className="info-box">
                  <span>Travel Date</span>
                  <strong>{booking.departureDate}</strong>
                </div>
                <div className="info-box">
                  <span>Departure Time</span>
                  <strong>{booking.departure || "—"}</strong>
                </div>
                <div className="info-box">
                  <span>Passengers</span>
                  <strong>{booking.passengers}</strong>
                </div>
                <div className="info-box">
                  <span>Email</span>
                  <strong>{booking["e-mail"] || booking.email}</strong>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="driver-actions">

                <button
                  className="boarding-btn"
                  onClick={() => updateStatus(booking, "boarding")}
                  disabled={
                    booking.travelStatus === "boarding" ||
                    booking.travelStatus === "departed" ||
                    booking.travelStatus === "arrived"
                  }
                >
                  🚏 Start Boarding
                </button>

                <button
                  className="departure-btn"
                  onClick={() => updateStatus(booking, "departed")}
                  disabled={
                    booking.travelStatus === "departed" ||
                    booking.travelStatus === "arrived"
                  }
                >
                  🚌 Departure
                </button>

                <button
                  className="arrival-btn"
                  onClick={() => updateStatus(booking, "arrived")}
                  disabled={booking.travelStatus === "arrived"}
                >
                  ✅ Arrival
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DriverPanel;
