import React, { useEffect, useState } from "react";

import "./PaymentSuccess.css";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../../firebase";

import emailjs from "@emailjs/browser";

import { Link } from "react-router-dom";

// =======================
// EMAILJS CONFIG
// =======================

const EMAILJS_SERVICE_ID = "service_w54sho2";
const EMAILJS_USER_TEMPLATE = "template_w8jlcvg";   // user confirmation
const EMAILJS_ADMIN_TEMPLATE = "template_7s50fav";  // admin notification
const EMAILJS_PUBLIC_KEY = "Q2aYrQi8_-EbYY6kQ";
const ADMIN_EMAIL = "deluxedrive05@gmail.com";

const PaymentSuccess = () => {

  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {

    const saveBooking = async () => {

      try {

        // =======================
        // GET BOOKING
        // =======================

        const booking = JSON.parse(localStorage.getItem("pendingBooking"));

        if (!booking) {
          console.log("No booking found");
          setDone(false);
          setLoading(false);
          return;
        }

        // =======================
        // SAVE BOOKING FIRESTORE
        // status = "approved" directly
        // =======================

        await addDoc(collection(db, "bookings"), {
          ...booking,
          "e-mail": booking["e-mail"] || booking.email,
          tripId: booking.tripId || "",
          returnTripId: booking.returnTrip?.id || "",
          paymentStatus: "paid",
          status: "approved",       // ← seedha approved
          travelStatus: "pending",
          reminderSent: false,
          thankYouSent: false,
          createdAt: new Date().toISOString(),
        });

        // =======================
        // UPDATE MAIN TRIP SEATS
        // =======================

        if (booking.tripId) {
          await updateDoc(doc(db, "trips", booking.tripId), {
            availableSeats: increment(-Number(booking.passengers)),
          });
        }

        // =======================
        // UPDATE RETURN TRIP SEATS
        // =======================

        if (booking.isRoundTrip && booking.returnTrip?.id) {
          await updateDoc(doc(db, "trips", booking.returnTrip.id), {
            availableSeats: increment(-Number(booking.passengers)),
          });
        }

        // =======================
        // USER CONFIRMATION EMAIL
        // =======================

        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_USER_TEMPLATE,
            {
              to_email: booking.email || booking["e-mail"],
              passenger_name: booking.passengerName,
              email: booking.email || booking["e-mail"],
              from: booking.from,
              to: booking.to,
              departure: booking.departureDate,
              arrival: booking.arrival || "",
              passengers: booking.passengers,
              total_price: booking.totalPrice,
              status: "Confirmed ✔️",
            },
            EMAILJS_PUBLIC_KEY
          );
          console.log("User confirmation email sent ✅");
        } catch (emailError) {
          console.log("User email failed:", emailError);
        }

        // =======================
        // ADMIN NOTIFICATION EMAIL
        // =======================

        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_ADMIN_TEMPLATE,
            {
              to_email: ADMIN_EMAIL,
              name: booking.passengerName,
              message: "New booking received",
              passenger_name: booking.passengerName,
              email: booking.email || booking["e-mail"],
              phone: booking.phone || "",
              from: booking.from,
              to: booking.to,
              departure: booking.departureDate,
              passengers: booking.passengers,
              total_price: booking.totalPrice,
            },
            EMAILJS_PUBLIC_KEY
          );
          console.log("Admin notification email sent ✅");
        } catch (emailError) {
          console.log("Admin email failed:", emailError);
        }

        // =======================
        // CLEAR STORAGE
        // =======================

        localStorage.removeItem("pendingBooking");

        setDone(true);

      } catch (error) {
        console.log("Payment success error:", error);
        setDone(false);
      } finally {
        setLoading(false);
      }
    };

    saveBooking();

  }, []);

  return (
    <div className="success-page">
      <div className="success-card">

        {loading ? (
          <>
            <div className="loader"></div>
            <h2>Processing Payment...</h2>
          </>

        ) : done ? (
          <>
            <div className="success-icon">✓</div>
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed.</p>
            <p>A confirmation email has been sent to you. 📧</p>
            <Link to="/"><button>Back To Home</button></Link>
          </>

        ) : (
          <>
            <h1>Something Went Wrong</h1>
            <p>Please contact support.</p>
            <Link to="/"><button>Back To Home</button></Link>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;
