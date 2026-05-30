import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import "./Ticket.css";

import { TypeAnimation } from "react-type-animation";
import { loadStripe } from "@stripe/stripe-js";
import RoutesSection from "../tickets/RoutesSection";
import DailyReservations from "../tickets/DailyReservations";

import Swal from "sweetalert2/dist/sweetalert2.js";

import {
  collection,
  getDocs,
  
} from "firebase/firestore";

import { db } from "../../firebase";

import Footer from "./Footer";

import carImage from "../../assets/car4.jpg";

import { LanguageContext } from "../../context/LanguageContext";

import translations from "../../translations";

// =======================
// STRIPE
// =======================
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const Ticket = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  // ======================
  // STATES
  // ======================
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  // ======================
  // FORM STATES
  // ======================
  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [passengers, setPassengers] = useState(1);

  // ======================
  // DATE STATES
  // ======================
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // ======================
  // TODAY DATE
  // ======================
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

  // ======================
  // FETCH TRIPS
  // ======================
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trips"));
        const data = snapshot.docs.map((docItem) => {
          const raw = docItem.data();
          return {
            id: docItem.id,
            ...raw,
            price: 90,
            availableSeats: Number(
              raw.availableSeats ?? raw["available Seats"] ?? 5
            ),
          };
        });
        setTrips(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // ======================
  // MODAL BODY FIX
  // ======================
  useEffect(() => {
    if (showBooking) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showBooking]);

  // ======================
  // OPEN ROUTE
  // ======================
  const openSchedules = (from, to) => {
    setSelectedRoute({ from, to });
    setTimeout(() => {
      const section = document.querySelector(".daily-reservations");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  // ======================
  // FILTER ROUTE TRIPS
  // ======================
  const getRouteTrips = () => {
    if (!selectedRoute) return [];
    return trips.filter(
      (trip) =>
        trip.from?.toLowerCase() === selectedRoute.from?.toLowerCase() &&
        trip.to?.toLowerCase() === selectedRoute.to?.toLowerCase() &&
        trip.status === "active"
    );
  };

  // ======================
  // OPEN BOOKING
  // ======================
  const handleSelectTrip = (trip, selectedDate) => {
    if (!selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Select Date First",
        text: "Please select travel date first",
      });
      return;
    }
    setDepartureDate(selectedDate);
    setSelectedTrip(trip);
    setShowBooking(true);
    setBookingStep(1);
  };

  // ======================
  // CLOSE MODAL
  // ======================
  const closeBookingModal = () => {
    setShowBooking(false);
    setPassengerName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassengers(1);
    setDepartureDate("");
    setReturnDate("");
    setIsRoundTrip(false);
    setSelectedReturnTrip(null);
    setBookingStep(1);
  };

  // ======================
  // STEP VALIDATION
  // ======================
  const validateStepOne = () => {
    if (!departureDate) {
      Swal.fire({ icon: "warning", title: "Departure Date Required", text: "Please select departure date" });
      return false;
    }
    if (isRoundTrip && !returnDate) {
      Swal.fire({ icon: "warning", title: "Return Date Required", text: "Please select return date" });
      return false;
    }
    if (isRoundTrip && returnDate < departureDate) {
      Swal.fire({ icon: "warning", title: "Invalid Return Date", text: "Return date cannot be earlier than departure date" });
      return false;
    }
    if (isRoundTrip && !selectedReturnTrip) {
      Swal.fire({ icon: "warning", title: "Return Trip Required", text: "Please select return trip" });
      return false;
    }
    return true;
  };

  // ======================
  // CONFIRM BOOKING
  // ======================
  const confirmBooking = async () => {

    // STEP 1 VALIDATION
    if (!validateStepOne()) return;

    // FIELDS VALIDATION
    if (!passengerName || !email || !phone || !address) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill all fields" });
      return;
    }

    // SEATS CHECK
    if (passengers > selectedTrip.availableSeats) {
      Swal.fire({ icon: "warning", title: "Seats Unavailable", text: `Only ${selectedTrip.availableSeats} seats available` });
      return;
    }

    if (isRoundTrip && selectedReturnTrip && passengers > selectedReturnTrip.availableSeats) {
      Swal.fire({ icon: "warning", title: "Return Trip Seats Unavailable", text: `Only ${selectedReturnTrip.availableSeats} seats available in return trip` });
      return;
    }

    setBookingLoading(true);

    try {

      const totalPrice = isRoundTrip ? 90 * passengers * 2 : 90 * passengers;

      // ======================
      // SAVE TO LOCALSTORAGE
      // (PaymentSuccess mein Firestore save hoga)
      // ======================
     const bookingData = {
  bookingId: Date.now().toString(),

  passengerName,
  "e-mail": email?.trim(),
  email: email?.trim(),

  phone,
  address,
  passengers,

  tripId: selectedTrip.id,

  from: selectedTrip.from,
  to: selectedTrip.to,

  departure: selectedTrip.departure || "",
  arrival: selectedTrip.arrival || "",

  duration: selectedTrip.duration || "",

  departureDate,

  returnDate: returnDate || "",

  isRoundTrip,

  returnTrip: selectedReturnTrip
    ? {
        id: selectedReturnTrip.id,
        from: selectedReturnTrip.from,
        to: selectedReturnTrip.to,
        departure:
          selectedReturnTrip.departure || "",
        arrival:
          selectedReturnTrip.arrival || "",
      }
    : null,

  returnTripId:
    selectedReturnTrip?.id || "",

  totalPrice,
};

localStorage.setItem(
  "pendingBooking",
  JSON.stringify(bookingData)
);

console.log(
  "BOOKING SAVED:",
  bookingData
);

      // ======================
      // UPDATE LOCAL UI ONLY
      // (Firestore seats PaymentSuccess mein update honge)
      // ======================
     

      Swal.fire({
        icon: "success",
        title: "Booking Successful",
        text: "Redirecting to payment...",
        timer: 2000,
        showConfirmButton: false,
      });

      // ======================
      // STRIPE REDIRECT
      // ======================
      const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);
      if (!apiUrl) {
        throw new Error("VITE_API_URL is not set in .env file");
      }

      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengers,
          isRoundTrip,
          email,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const session = await response.json();

      if (!session.url) {
        throw new Error("No redirect URL from Stripe");
      }
console.log("LOCALSTORAGE CHECK")
      window.location.href=(session.url);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <>
      {/* HERO */}
      <div className="ticket-hero">
        <img src={carImage} alt="" className="ticket-hero-img" />
        <div className="ticket-hero-overlay" />
        <div className="ticket-hero-content">
          <p className="ticket-hero-tag">TICKET RESERVATION</p>
          <h1>Book Your Luxury Journey</h1>
          <TypeAnimation
            sequence={[
              "Experience Comfortable Long Distance Travel", 2000,
              "Safe & Luxury Travel Experience", 2000,
              "Premium Rides Across Canada", 2000,
            ]}
            wrapper="p"
            speed={50}
            repeat={Infinity}
            className="ticket-animated-text"
          />
        </div>
      </div>

      {/* ROUTES */}
      <RoutesSection trips={trips} loading={loading} openSchedules={openSchedules} />

      {/* DAILY RESERVATIONS */}
      <DailyReservations
        selectedRoute={selectedRoute}
        trips={getRouteTrips()}
        handleSelectTrip={handleSelectTrip}
      />

      {/* BOOKING MODAL */}
      {showBooking && selectedTrip && (
        <div className="booking-modal-overlay" onClick={closeBookingModal}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>

            {/* HEADER */}
            <div className="booking-modal-header">
              <h2>Complete Reservation</h2>
              <button className="modal-close-btn" onClick={closeBookingModal}>✕</button>
            </div>

            <p className="selected-route">
              {selectedTrip.from} {" → "} {selectedTrip.to}
            </p>

            <div className="trip-details">
              <p>Departure: <span>{selectedTrip.departure}</span></p>
              <p>Arrival: <span>{selectedTrip.arrival}</span></p>
            </div>

            {/* STEP 1 — TRIP OPTIONS */}
            {bookingStep === 1 && (
              <>
                {/* TRIP TYPE */}
                <div className="trip-type-ticket">
                  <button
                    className={!isRoundTrip ? "active-trip-btn" : ""}
                    onClick={() => setIsRoundTrip(false)}
                  >
                    One Way
                  </button>
                  <button
                    className={isRoundTrip ? "active-trip-btn" : ""}
                    onClick={() => setIsRoundTrip(true)}
                  >
                    Round Trip
                  </button>
                </div>

                {/* DEPARTURE DATE */}
                <div className="date-box">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    min={minDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>

                {/* RETURN DATE */}
                {isRoundTrip && (
                  <div className="date-box">
                    <label>Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate || minDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                )}

                {/* SEATS */}
                <div className="seat-left-box">
                  {selectedTrip.availableSeats} Seats Remaining
                </div>

                {/* PASSENGERS */}
                <div className="passenger-select">
                  <label>Number Of Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  >
                    {[...Array(selectedTrip.availableSeats)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                {/* RETURN TRIP */}
                {isRoundTrip && (
                  <div className="return-trip-box">
                    <label>Select Return Trip</label>
                    <select
                      value={selectedReturnTrip?.id || ""}
                      onChange={(e) => {
                        const foundTrip = trips.find((trip) => trip.id === e.target.value);
                        setSelectedReturnTrip(foundTrip);
                      }}
                    >
                      <option value="">Select Return Time</option>
                      {trips
                        .filter(
                          (trip) =>
                            trip.from === selectedTrip.to &&
                            trip.to === selectedTrip.from &&
                            trip.status === "active"
                        )
                        .map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.departure} {" → "} {trip.arrival} {" | "} {trip.availableSeats} seats
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* TOTAL */}
                <h3 className="booking-total">
                  Total: ${isRoundTrip ? 90 * passengers * 2 : 90 * passengers}
                </h3>

                {/* NEXT BUTTON */}
                <button
                  className="next-step-btn"
                  onClick={() => {
                    if (validateStepOne()) setBookingStep(2);
                  }}
                >
                  Next →
                </button>
              </>
            )}

            {/* STEP 2 — PASSENGER INFO */}
            {bookingStep === 2 && (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <h3 className="booking-total">
                  Total: ${isRoundTrip ? 90 * passengers * 2 : 90 * passengers}
                </h3>

                <div className="modal-buttons">
                  <button className="back-step-btn" onClick={() => setBookingStep(1)}>
                    ← Back
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={confirmBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "Processing..." : "Confirm & Pay"}
                  </button>
                </div>
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
