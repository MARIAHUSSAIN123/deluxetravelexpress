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
const EMAILJS_TEMPLATE_ID = "template_w8jlcvg";
const EMAILJS_PUBLIC_KEY = "Q2aYrQi8_-EbYY6kQ";

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
        .map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }))
        .filter((booking) => booking.status === "approved");
      setBookings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS + EMAILS
  // =========================

  const updateStatus = async (booking, status) => {
    try {

      await updateDoc(doc(db, "bookings", booking.id), {
        travelStatus: status,
      });

      console.log("STATUS UPDATED:", status);

      const userEmail = booking["e-mail"] || booking.email;
      const departureTime = booking.departure || booking.departureDate;

      // =========================
      // BOARDING → 2 ghante pehle reminder
      // =========================

      if (status === "boarding") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: userEmail,
            passenger_name: booking.passengerName,
            from: booking.from,
            to: booking.to,
            departure: departureTime,
            arrival: booking.arrival || "",
            passengers: booking.passengers,
            total_price: booking.totalPrice || "",
            status: `⏰ Reminder: Your Deluxe Travel Express bus departs at ${departureTime}. Please be at the stop on time!`,
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("2HR REMINDER EMAIL SENT");
      }

      // =========================
      // DEPARTURE → trip started email
      // =========================

      if (status === "departed") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: userEmail,
            passenger_name: booking.passengerName,
            from: booking.from,
            to: booking.to,
            departure: departureTime,
            arrival: booking.arrival || "",
            passengers: booking.passengers,
            total_price: booking.totalPrice || "",
            status: "🚌 Your trip has departed! Sit back and enjoy the journey.",
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log("DEPARTURE EMAIL SENT");
      }

      // =========================
      // ARRIVAL → 4 ghante baad thank you
      // =========================

      if (status === "arrived") {

        const FOUR_HOURS = 4 * 60 * 60 * 1000;

        setTimeout(async () => {
          try {
            await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              {
                to_email: userEmail,
                passenger_name: booking.passengerName,
                from: booking.from,
                to: booking.to,
                departure: departureTime,
                arrival: booking.arrival || "",
                passengers: booking.passengers,
                total_price: booking.totalPrice || "",
                status: "Dear Customer, We would like to extend our sincere thanks for traveling with Deluxe Travel Express. Your trust is invaluable to us, and we are honored to have accompanied you on your journey. We hope your experience combined comfort, peace of mind, and quality service. We look forward to welcoming you again very soon! — The Deluxe Travel Express Team 🌟",
              },
              EMAILJS_PUBLIC_KEY
            );

            await updateDoc(doc(db, "bookings", booking.id), {
              thankYouSent: true,
            });

            console.log("THANK YOU EMAIL SENT");
          } catch (err) {
            console.log("Thank you email error:", err);
          }
        }, FOUR_HOURS);

        console.log("Thank you email scheduled for 4 hours later");
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
        <p>Manage passenger trip updates</p>
      </div>

      {loading ? (
        <div className="driver-loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="driver-empty">No approved bookings found</div>
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
