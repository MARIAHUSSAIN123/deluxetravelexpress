

import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import "./Ticket.css";

import RoutesSection from "../tickets/RoutesSection";
import DailyReservations from "../tickets/DailyReservations";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db, auth } from "../../firebase";

import Footer from "./Footer";

import carImage from "../../assets/car4.jpg";

const Ticket = () => {
  const { language } =
    useContext(LanguageContext);

  const [from, setFrom] =
    useState("");

  const t =
    translations[language] ||
    translations.en;

  // STATES
  const [trips, setTrips] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedRoute, setSelectedRoute] =
    useState(null);

  const [selectedTrip, setSelectedTrip] =
    useState(null);

  const [showBooking, setShowBooking] =
    useState(false);

  const [passengerName, setPassengerName] =
    useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [passengers, setPassengers] =
    useState(1);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [bookingStep, setBookingStep] =
    useState(1);

  const [address, setAddress] =
    useState("");

  // FETCH TRIPS
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "trips")
        );

        const data = snapshot.docs.map(
          (docItem) => {
            const raw = docItem.data();

            return {
              id: docItem.id,
              ...raw,

              price: 90,

              availableSeats: Number(
                raw.availableSeats ??
                  raw["available Seats"] ??
                  5
              ),
            };
          }
        );

        setTrips(data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchTrips();
  }, []);

  // MODAL BODY FIX
  useEffect(() => {
    if (showBooking) {
      document.body.classList.add(
        "modal-open"
      );
    } else {
      document.body.classList.remove(
        "modal-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "modal-open"
      );
    };
  }, [showBooking]);

  // OPEN SCHEDULES
  const openSchedules = (from, to) => {
    setSelectedRoute({ from, to });

    setTimeout(() => {
      const section =
        document.querySelector(
          ".daily-reservations"
        );

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  // FILTER ROUTE TRIPS
  const getRouteTrips = () => {
    if (!selectedRoute) return [];

    return trips.filter(
      (trip) =>
        trip.from?.toLowerCase() ===
          selectedRoute.from?.toLowerCase() &&
        trip.to?.toLowerCase() ===
          selectedRoute.to?.toLowerCase() &&
        trip.status === "active"
    );
  };

  // OPEN BOOKING
  const handleBooking = (trip) => {
    setSelectedTrip(trip);

    setShowBooking(true);

    setBookingSuccess(false);

    setBookingStep(1);
  };

  // CLOSE MODAL
  const closeBookingModal = () => {
    setShowBooking(false);

    setPassengerName("");

    setEmail("");

    setPhone("");

    setAddress("");

    setPassengers(1);

    setBookingStep(1);

    setBookingSuccess(false);
  };

  // CONFIRM BOOKING
  const confirmBooking = async () => {
    if (
      !passengerName ||
      !email ||
      !phone ||
      !address
    ) {
      alert("Please fill all fields");

      return;
    }

    // CHECK SEATS
    if (
      passengers >
      selectedTrip.availableSeats
    ) {
      alert(
        `Only ${selectedTrip.availableSeats} seats available`
      );

      return;
    }

    setBookingLoading(true);

    try {
      // TRIP REF
      const selectedTripRef = doc(
        db,
        "trips",
        selectedTrip.id
      );

      // SAVE BOOKING
      await addDoc(
        collection(db, "bookings"),
        {
          userId:
            auth.currentUser?.uid || "",

          userEmail:
            auth.currentUser?.email || "",

          passengerName,
          email,
          phone,

          address,

          paymentMethod:
            "Stripe Payment Link",

          passengers,

          from: selectedTrip.from,
          to: selectedTrip.to,

          departure:
            selectedTrip.departure,

          arrival:
            selectedTrip.arrival,

          duration:
            selectedTrip.duration,

          totalPrice:
            90 * passengers,

          availableSeats:
            selectedTrip.availableSeats -
            Number(passengers),

          status: "pending",

          createdAt: new Date(),
        }
      );

      // UPDATE FIRESTORE SEATS
      await updateDoc(
        selectedTripRef,
        {
          availableSeats: increment(
            -Number(passengers)
          ),
        }
      );

      // UPDATE LOCAL UI
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === selectedTrip.id
            ? {
                ...trip,

                availableSeats:
                  trip.availableSeats -
                  Number(passengers),
              }
            : trip
        )
      );

      // UPDATE SELECTED TRIP UI
      setSelectedTrip((prev) => ({
        ...prev,

        availableSeats:
          prev.availableSeats -
          Number(passengers),
      }));

      // SUCCESS
      setBookingSuccess(true);

      // REDIRECT TO STRIPE
      window.location.href =
        "https://buy.stripe.com/test_3cI14n36D1ObeyKciI5AQ00";

      // RESET FORM
      setPassengerName("");

      setEmail("");

      setPhone("");

      setPassengers(1);
    } catch (error) {
      console.log(error);

      alert(
        error?.message ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <div className="ticket-hero">
        <img
          src={carImage}
          alt=""
          className="ticket-hero-img"
        />

        <div className="ticket-hero-overlay" />

        <div className="ticket-hero-content">
          <p className="ticket-hero-tag">
            TICKET RESERVATION
          </p>

          <h1>
            Book Your Luxury Journey
          </h1>
        </div>
      </div>

      {/* ROUTES */}
      <RoutesSection
        trips={trips}
        loading={loading}
        openSchedules={openSchedules}
      />

      {/* DAILY RESERVATIONS */}
      <DailyReservations
        selectedRoute={selectedRoute}
        trips={getRouteTrips()}
        handleBooking={handleBooking}
      />

      {/* BOOKING MODAL */}
      {showBooking && selectedTrip && (
        <div
          className="booking-modal-overlay"
          onClick={() =>
            closeBookingModal()
          }
        >
          <div
            className="booking-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {bookingSuccess ? (
              <div className="booking-success">
                <h2>
                  Booking Confirmed
                </h2>

                <button
                  className="confirm-btn"
                  onClick={() =>
                    closeBookingModal()
                  }
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div className="booking-modal-header">
                  <h2>
                    Complete Reservation
                  </h2>

                  <button
                    className="modal-close-btn"
                    onClick={() =>
                      closeBookingModal()
                    }
                  >
                    ✕
                  </button>
                </div>

                {/* ROUTE */}
                <p className="selected-route">
                  {selectedTrip.from} →
                  {selectedTrip.to}
                </p>

                {/* DETAILS */}
                <div className="trip-details">
                  <p>
                    Departure:
                    <span>
                      {
                        selectedTrip.departure
                      }
                    </span>
                  </p>

                  <p>
                    Arrival:
                    <span>
                      {
                        selectedTrip.arrival
                      }
                    </span>
                  </p>
                </div>

                {/* STEP 1 */}
                {bookingStep === 1 && (
                  <>
                    {/* SEATS */}
                    <div className="seat-left-box">
                      {
                        selectedTrip.availableSeats
                      }{" "}
                      Seats Remaining
                    </div>

                    {/* PASSENGERS */}
                    <div className="passenger-select">
                      <label>
                        Number Of Passengers
                      </label>

                      <select
                        value={passengers}
                        onChange={(e) =>
                          setPassengers(
                            Number(
                              e.target.value
                            )
                          )
                        }
                      >
                        {[
                          ...Array(
                            selectedTrip.availableSeats
                          ),
                        ].map((_, i) => (
                          <option
                            key={i + 1}
                            value={i + 1}
                          >
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* TOTAL */}
                    <h3 className="booking-total">
                      Total: $
                      {90 * passengers} CAD
                    </h3>

                    {/* BUTTONS */}
                    <div className="booking-actions">
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          closeBookingModal()
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="confirm-btn"
                        onClick={() =>
                          setBookingStep(2)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {bookingStep === 2 && (
                  <>
                    {/* INPUTS */}
                    <input
                      type="text"
                      placeholder="First & Last Name"
                      value={passengerName}
                      onChange={(e) =>
                        setPassengerName(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                    />

                    {/* ADDRESS */}
                    <input
                      type="text"
                      placeholder="Home Address"
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                    />

                    {/* TOTAL */}
                    <h3 className="booking-total">
                      Total: $
                      {90 * passengers} CAD
                    </h3>

                    {/* BUTTONS */}
                    <div className="booking-actions">
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          setBookingStep(1)
                        }
                      >
                        Back
                      </button>

                      <button
                        className="confirm-btn"
                        onClick={
                          confirmBooking
                        }
                        disabled={
                          bookingLoading
                        }
                      >
                        {bookingLoading
                          ? "Processing..."
                          : "Confirm Booking"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Ticket;

