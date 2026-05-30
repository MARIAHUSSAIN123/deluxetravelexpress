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

const EMAILJS_SERVICE_ID =
  "service_w54sho2";

const EMAILJS_ADMIN_TEMPLATE =
  "template_7s50fav";

const EMAILJS_PUBLIC_KEY =
  "Q2aYrQi8_-EbYY6kQ";

// =======================
// ADMIN EMAIL
// =======================

const ADMIN_EMAIL =
  "deluxedrive05@gmail.com";

// =======================
// COMPONENT
// =======================

const PaymentSuccess = () => {

  const [loading, setLoading] =
    useState(true);

  const [done, setDone] =
    useState(false);

  useEffect(() => {

    const saveBooking =
      async () => {

        try {

          // =======================
          // GET BOOKING
          // =======================

          const booking =
            JSON.parse(
              localStorage.getItem(
                "pendingBooking"
              )
            );

          if (!booking) {

            console.log(
              "No booking found"
            );

            setDone(false);

            setLoading(false);

            return;
          }

          // =======================
          // SAVE BOOKING FIRESTORE
          // =======================

          await addDoc(
            collection(
              db,
              "bookings"
            ),

            {
              ...booking,

              "e-mail":
                booking["e-mail"] ||
                booking.email,

              tripId:
                booking.tripId || "",

              returnTripId:
                booking.returnTrip?.id || "",

              paymentStatus:
                "paid",

              status:
                "pending",

              travelStatus:
                "pending",

              reminderSent:
                false,

              thankYouSent:
                false,

              createdAt:
                new Date().toISOString(),
            }
          );

          // =======================
          // UPDATE MAIN TRIP SEATS
          // =======================

          if (
            booking.tripId
          ) {

            const tripRef =
              doc(
                db,
                "trips",
                booking.tripId
              );

            await updateDoc(
              tripRef,

              {
                availableSeats:
                  increment(
                    -Number(
                      booking.passengers
                    )
                  ),
              }
            );
          }

          // =======================
          // UPDATE RETURN TRIP SEATS
          // =======================

          if (
            booking.isRoundTrip &&
            booking.returnTrip?.id
          ) {

            const returnTripRef =
              doc(
                db,
                "trips",
                booking.returnTrip.id
              );

            await updateDoc(
              returnTripRef,

              {
                availableSeats:
                  increment(
                    -Number(
                      booking.passengers
                    )
                  ),
              }
            );
          }

          // =======================
          // SEND ADMIN EMAIL
          // =======================

          try {

            await emailjs.send(

              EMAILJS_SERVICE_ID,

              EMAILJS_ADMIN_TEMPLATE,

              {

                to_email:
                  ADMIN_EMAIL,
                  name:booking.passengerName,
                  message:"New booking received",
                  passenger_name:booking.pessangerName,
                  email: booking["e-mail"] || booking.email,
                  phone:booking.phone || "",
                  from: booking.from,
                  to:booking.to,
                 departure:booking.departureDate,
                 passengers:booking.passengers,
                 total_price:booking.totalPrice,
              },

              EMAILJS_PUBLIC_KEY
            );

            console.log(
              "Admin email sent"
            );

          } catch (emailError) {

            console.log(
              "Email failed:",
              emailError
            );
          }

          // =======================
          // CLEAR STORAGE
          // =======================

          // localStorage.removeItem(
          //   "pendingBooking"
          // );

          setDone(true);

        } catch (error) {

          console.log(
            "Payment success error:",
            error
          );

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

            <h2>
              Processing Payment...
            </h2>

          </>

        ) : done ? (

          <>

            <div className="success-icon">
              ✓
            </div>

            <h1>
              Payment Successful
            </h1>

            <p>
              Your booking request
              has been submitted
              successfully.
            </p>

            <p>
              Admin will review and
              approve your booking
              soon.
            </p>

            <Link to="/">

              <button>
                Back To Home
              </button>

            </Link>

          </>

        ) : (

          <>

            <h1>
              Something Went Wrong
            </h1>

          </>

        )}

      </div>

    </div>
  );
};

export default PaymentSuccess;