import React, {
  useContext,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";

import { LanguageContext } from "../context/LanguageContext";

import Swal from "sweetalert2";

import translations from "../translations";

import "./Hero.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const Hero = () => {

  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const [bookingData, setBookingData] = useState({
    origin: "",
    destination: "",
    tripType: "One Way",
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    seats: 1,
  });

  // =====================
  // HANDLE INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // DEPARTURE TIMES
  // =====================
  const getDepartureTimes = () => {
    if (bookingData.origin === "Calgary" && bookingData.destination === "Edmonton") {
      return ["07:00 AM", "09:00 AM", "03:00 PM", "05:00 PM"];
    }
    if (bookingData.origin === "Edmonton" && bookingData.destination === "Calgary") {
      return ["11:00 AM", "01:00 PM", "07:00 PM", "09:00 PM"];
    }
    return [];
  };

  // =====================
  // RETURN TIMES
  // =====================
  const getReturnTimes = () => {
    if (bookingData.origin === "Calgary" && bookingData.destination === "Edmonton") {
      return ["11:00 AM", "01:00 PM", "07:00 PM", "09:00 PM"];
    }
    if (bookingData.origin === "Edmonton" && bookingData.destination === "Calgary") {
      return ["07:00 AM", "09:00 AM", "03:00 PM", "05:00 PM"];
    }
    return [];
  };

  // =====================
  // HANDLE BOOKING
  // =====================
  const handleBooking = async () => {

    if (!bookingData.origin || !bookingData.destination) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please select origin and destination",
      });
      return;
    }

    if (bookingData.origin === bookingData.destination) {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "Origin and destination cannot be the same",
      });
      return;
    }

    if (!bookingData.departureDate) {
      Swal.fire({
        icon: "warning",
        title: "Departure Date Required",
        text: "Please select departure date",
      });
      return;
    }

    if (!bookingData.departureTime) {
      Swal.fire({
        icon: "warning",
        title: "Departure Time Required",
        text: "Please select departure time",
      });
      return;
    }

    if (bookingData.tripType === "Round Trip" && !bookingData.returnDate) {
      Swal.fire({
        icon: "warning",
        title: "Return Date Required",
        text: "Please select return date",
      });
      return;
    }

    if (bookingData.tripType === "Round Trip" && !bookingData.returnTime) {
      Swal.fire({
        icon: "warning",
        title: "Return Time Required",
        text: "Please select return time",
      });
      return;
    }

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passengers: Number(bookingData.seats),
            isRoundTrip: bookingData.tripType === "Round Trip",
            email: "test@gmail.com",
          }),
        }
      );

      const session = await response.json();

      window.location.href = session.url;

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Something went wrong",
      });
    }
  };

  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      {/* HERO CONTENT */}
      <div className="hero-content">
        <h1>
          Deluxe <span>Travel</span> Express
        </h1>
        <p className="hero-slogan">{t.heroSlogan}</p>
        <p className="hero-text">{t.heroText}</p>
        <Link to="/routes" className="explore-btn">
          {t.explore}
        </Link>
      </div>

      {/* BOOKING BOX */}
      <div className="booking-box">

        {/* ORIGIN */}
        <select
          name="origin"
          value={bookingData.origin}
          onChange={handleChange}
        >
          <option value="">{t.origin}</option>
          <option value="Calgary">Calgary</option>
          <option value="Edmonton">Edmonton</option>
        </select>

        {/* DESTINATION */}
        <select
          name="destination"
          value={bookingData.destination}
          onChange={handleChange}
        >
          <option value="">{t.destination}</option>
          <option value="Calgary">Calgary</option>
          <option value="Edmonton">Edmonton</option>
        </select>

        {/* TRIP TYPE */}
        <div className="trip-type">
          <button
            type="button"
            className={bookingData.tripType === "One Way" ? "active" : ""}
            onClick={() =>
              setBookingData({
                ...bookingData,
                tripType: "One Way",
                returnDate: "",
                returnTime: "",
              })
            }
          >
            {t.oneWay}
          </button>
          <button
            type="button"
            className={bookingData.tripType === "Round Trip" ? "active" : ""}
            onClick={() =>
              setBookingData({
                ...bookingData,
                tripType: "Round Trip",
              })
            }
          >
            {t.roundTrip}
          </button>
        </div>

        {/* SEATS */}
        <select
          name="seats"
          value={bookingData.seats}
          onChange={handleChange}
        >
          <option value="1">1 Seat</option>
          <option value="2">2 Seats</option>
          <option value="3">3 Seats</option>
          <option value="4">4 Seats</option>
          <option value="5">5 Seats</option>
        </select>

        {/* DEPARTURE DATE */}
        <input
          type="date"
          name="departureDate"
          value={bookingData.departureDate}
          onChange={handleChange}
          style={{ colorScheme: "dark" }}
        />

        {/* DEPARTURE TIME */}
        <select
          name="departureTime"
          value={bookingData.departureTime}
          onChange={handleChange}
        >
          <option value="">Select Departure Time</option>
          {getDepartureTimes().map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        {/* ROUND TRIP */}
        {bookingData.tripType === "Round Trip" && (
          <>
            {/* RETURN DATE */}
            <input
              type="date"
              name="returnDate"
              value={bookingData.returnDate}
              onChange={handleChange}
              style={{ colorScheme: "dark" }}
            />

            {/* RETURN TIME */}
            <select
              name="returnTime"
              value={bookingData.returnTime}
              onChange={handleChange}
            >
              <option value="">Select Return Time</option>
              {getReturnTimes().map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </>
        )}

        {/* BOOK BUTTON */}
        <button className="book-btn" onClick={handleBooking}>
          {t.bookNow}
        </button>

      </div>

    </section>
  );
};

export default Hero;
