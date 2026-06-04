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

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const Ticket = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  const [passengerName, setPassengerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

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

  useEffect(() => {
    if (showBooking) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showBooking]);

  const openSchedules = (from, to) => {
    setSelectedRoute({ from, to });
    setTimeout(() => {
      const section = document.querySelector(".daily-reservations");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const getRouteTrips = () => {
    if (!selectedRoute) return [];
    return trips.filter(
      (trip) =>
        trip.from?.toLowerCase() === selectedRoute.from?.toLowerCase() &&
        trip.to?.toLowerCase() === selectedRoute.to?.toLowerCase() &&
        trip.status === "active"
    );
  };

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

  const confirmBooking = async () => {
    if (!validateStepOne()) return;

    if (!passengerName || !email || !phone || !address) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill all fields" });
      return;
    }

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
              departure: selectedReturnTrip.departure || "",
              arrival: selectedReturnTrip.arrival || "",
            }
          : null,
        returnTripId: selectedReturnTrip?.id || "",
        totalPrice,
      };

      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      Swal.fire({
        icon: "success",
        title: "Booking Successful",
        text: "Redirecting to payment...",
        timer: 2000,
        showConfirmButton: false,
      });

      const apiUrl = import.meta.env.VITE_API_URL || "https://deluxetravelexpress-4j89.vercel.app";

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

      window.location.href = session.url;

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

  return (
    <>
      {/* HERO */}
      <div className="ticket-hero">
        <img src={carImage} alt="" className="ticket-hero-img" />
        <div className="ticket-hero-overlay" />
        <div className="ticket-hero-content">
          <p className="ticket-hero-tag">{t.ticketTag}</p>
          <h1>{t.ticketHeading}</h1>
          <TypeAnimation
            sequence={[
              t.ticketAnim1, 2000,
              t.ticketAnim2, 2000,
              t.ticketAnim3, 2000,
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
              <h2>{t.completeReservation}</h2>
              <button className="modal-close-btn" onClick={closeBookingModal}>✕</button>
            </div>

            <p className="selected-route">
              {selectedTrip.from} {" → "} {selectedTrip.to}
            </p>

            {/* TRIP DETAILS */}
            <div className="trip-details">
              <div className="trip-details-row">
                <div>
                  <p>{t.departure}: <span>{selectedTrip.departure}</span></p>
                  <p>{t.arrival}: <span>{selectedTrip.arrival}</span></p>
                </div>
                <div className="seat-left-box">
                  🟡 {selectedTrip.availableSeats} {t.seatsRemaining}
                </div>
              </div>
            </div>

            {/* STEP 1 */}
            {bookingStep === 1 && (
              <>
                <div className="trip-type-ticket">
                  <button
                    className={!isRoundTrip ? "active-trip-btn" : ""}
                    onClick={() => setIsRoundTrip(false)}
                  >
                    {t.oneWay}
                  </button>
                  <button
                    className={isRoundTrip ? "active-trip-btn" : ""}
                    onClick={() => setIsRoundTrip(true)}
                  >
                    {t.roundTrip}
                  </button>
                </div>

                <div className="passenger-select">
                  <label>{t.numberOfPassengers}</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                  >
                    {[...Array(selectedTrip.availableSeats)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="date-box">
                  <label>{t.departureDate}</label>
                  <input
                    type="date"
                    value={departureDate}
                    min={minDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>

                {isRoundTrip && (
                  <div className="date-box">
                    <label>{t.returnDate}</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={departureDate || minDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                )}

                {isRoundTrip && (
                  <div className="return-trip-box">
                    <label>{t.selectReturnTrip}</label>
                    <select
                      value={selectedReturnTrip?.id || ""}
                      onChange={(e) => {
                        const foundTrip = trips.find((trip) => trip.id === e.target.value);
                        setSelectedReturnTrip(foundTrip);
                      }}
                    >
                      <option value="">{t.selectReturnTime}</option>
                      {trips
                        .filter(
                          (trip) =>
                            trip.from === selectedTrip.to &&
                            trip.to === selectedTrip.from &&
                            trip.status === "active"
                        )
                        .map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.departure} {" → "} {trip.arrival} {" | "} {trip.availableSeats} {t.seat}
                          </option>
                        ))}
                    </select>

                    {selectedReturnTrip && (
                      <div className="seat-left-box return-seat-box">
                        🟡 {selectedReturnTrip.availableSeats} {t.seatsRemainingReturn}
                      </div>
                    )}
                  </div>
                )}

                <h3 className="booking-total">
                  {t.total}: ${isRoundTrip ? 90 * passengers * 2 : 90 * passengers}
                </h3>

                <button
                  className="next-step-btn"
                  onClick={() => {
                    if (validateStepOne()) setBookingStep(2);
                  }}
                >
                  {t.next}
                </button>
              </>
            )}

            {/* STEP 2 */}
            {bookingStep === 2 && (
              <>
                <div className="form-group">
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    placeholder={t.enterFullName}
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{t.emailLabel}</label>
                  <input
                    type="email"
                    placeholder={t.enterEmailLabel}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{t.phoneLabel}</label>
                  <input
                    type="tel"
                    placeholder={t.enterPhoneLabel}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{t.addressLabel}</label>
                  <input
                    type="text"
                    placeholder={t.enterAddressLabel}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <h3 className="booking-total">
                  {t.total}: ${isRoundTrip ? 90 * passengers * 2 : 90 * passengers}
                </h3>

                <div className="modal-buttons">
                  <button className="back-step-btn" onClick={() => setBookingStep(1)}>
                    {t.back}
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={confirmBooking}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? t.processing : t.confirmPay}
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