import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import translations from "../translations";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";
import Footer from "./pages/Footer";
import "./Hero.css";

const Hero = () => {

  const navigate = useNavigate();

  const { language } =
    useContext(LanguageContext);

  const t =
    translations[language];

  const [bookingData, setBookingData] =
    useState({
      origin: "",
      destination: "",
      tripType: "One Way",
      departureDate: "",
      returnDate: "",
      seats: 1,
      selectedTripId: "",
    });

  const [availableTrips, setAvailableTrips] =
    useState([]);

  // FETCH TRIPS
  const fetchTrips = async (
    origin,
    destination
  ) => {

    if (
      !origin ||
      !destination ||
      origin === destination
    ) {

      setAvailableTrips([]);

      return;
    }

    try {

      const q = query(
        collection(db, "trips"),

        where("from", "==", origin),

        where("to", "==", destination),

        where("status", "==", "active")
      );

      const snapshot =
        await getDocs(q);

      const trips =
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

      setAvailableTrips(trips);

      setBookingData((prev) => ({
        ...prev,
        selectedTripId: "",
      }));

    } catch (error) {

      console.log(
        "Error fetching trips:",
        error
      );

    }

  };

  // HANDLE ORIGIN / DESTINATION
  const handleRouteChange = (e) => {

    const { name, value } =
      e.target;

    const updated = {
      ...bookingData,
      [name]: value,
    };

    setBookingData(updated);

    const origin =
      name === "origin"
        ? value
        : bookingData.origin;

    const destination =
      name === "destination"
        ? value
        : bookingData.destination;

    fetchTrips(
      origin,
      destination
    );

  };

  // HANDLE OTHER INPUTS
  const handleChange = (e) => {

    setBookingData({
      ...bookingData,
      [e.target.name]:
        e.target.value,
    });

  };

  // HANDLE BOOKING
  const handleBooking = () => {

    if (
      !bookingData.origin ||
      !bookingData.destination
    ) {

      alert(
        "Please select origin and destination"
      );

      return;
    }

    if (
      bookingData.origin ===
      bookingData.destination
    ) {

      alert(
        "Origin and destination cannot be the same"
      );

      return;
    }

    if (
      !bookingData.departureDate
    ) {

      alert(
        "Please select departure date"
      );

      return;
    }

    navigate("/ticket", {
      state: {
        selectedRoute:
          `${bookingData.origin}-${bookingData.destination}`,

        seats:
          bookingData.seats,

        departureDate:
          bookingData.departureDate,

        tripType:
          bookingData.tripType,
      },
    });

  };

  return (

    <section className="hero">

      <div className="hero-overlay"></div>

      {/* LEFT CONTENT */}
      <div className="hero-content">

        <h1>
          Deluxe <span>Travel</span> Express
        </h1>

        <p className="hero-slogan">
          {t.heroSlogan}
        </p>

        <p>
          {t.heroText}
        </p>

        <Link
          to="/routes"
          className="explore-btn"
        >
          {t.explore}
        </Link>

      </div>

      {/* RIGHT BOOKING BOX */}
      <div className="booking-box">

        {/* ORIGIN */}
        <select
          name="origin"
          value={bookingData.origin}
          onChange={handleRouteChange}
        >

          <option value="">
            {t.origin}
          </option>

          <option value="Calgary">
            Calgary
          </option>

          <option value="Edmonton">
            Edmonton
          </option>

        </select>

        {/* DESTINATION */}
        <select
          name="destination"
          value={
            bookingData.destination
          }
          onChange={handleRouteChange}
        >

          <option value="">
            {t.destination}
          </option>

          <option value="Calgary">
            Calgary
          </option>

          <option value="Edmonton">
            Edmonton
          </option>

        </select>

        {/* TRIP TYPE */}
        <div className="trip-type">

          <button
            type="button"
            className={
              bookingData.tripType ===
              "One Way"
                ? "active"
                : ""
            }
            onClick={() =>
              setBookingData({
                ...bookingData,
                tripType:
                  "One Way",
                returnDate: "",
              })
            }
          >
            {t.oneWay}
          </button>

          <button
            type="button"
            className={
              bookingData.tripType ===
              "Round Trip"
                ? "active"
                : ""
            }
            onClick={() =>
              setBookingData({
                ...bookingData,
                tripType:
                  "Round Trip",
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

          <option value="1">
            1 Seat
          </option>

          <option value="2">
            2 Seats
          </option>

          <option value="3">
            3 Seats
          </option>

          <option value="4">
            4 Seats
          </option>

          <option value="5">
            5 Seats
          </option>

        </select>

        {/* AVAILABLE TRIPS */}
        {availableTrips.length >
          0 && (

          <select
            name="selectedTripId"
            value={
              bookingData.selectedTripId
            }
            onChange={handleChange}
          >

            <option value="">
              Select Departure Time
            </option>

            {availableTrips.map(
              (trip) => {

                const seats =
                  Number(
                    trip.availableSeats
                  );

                const isSoldOut =
                  seats === 0;

                return (

                  <option
                    key={trip.id}
                    value={trip.id}
                    disabled={isSoldOut}
                  >

                    {isSoldOut
                      ? `${trip.departure} → ${trip.arrival} | SOLD OUT`

                      : `${trip.departure} → ${trip.arrival} | ${seats} seats`}

                  </option>

                );

              }
            )}

          </select>

        )}

        {/* DEPARTURE DATE */}
        <input
          type="date"
          name="departureDate"
          value={
            bookingData.departureDate
          }
          onChange={handleChange}
          style={{
            colorScheme: "dark",
          }}
        />

        {/* RETURN DATE */}
        <input
          type="date"
          name="returnDate"
          value={
            bookingData.returnDate
          }
          onChange={handleChange}
          disabled={
            bookingData.tripType ===
            "One Way"
          }
          style={{
            colorScheme: "dark",
          }}
        />

        {/* BOOK BUTTON */}
        <button
          className="book-btn"
          onClick={handleBooking}
        >
          {t.bookNow}
        </button>

      </div>

    </section>

  );

};

export default Hero;