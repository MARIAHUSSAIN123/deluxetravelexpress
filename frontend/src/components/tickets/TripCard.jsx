import React from "react";
import SeatIndicator from "./SeatIndicator";

const TripCard = ({
  trip,
  handleBooking,
}) => {
  return (
    <div className="schedule-card">
      <div className="schedule-left">
        <h3>
          {trip.departure} →{" "}
          {trip.arrival}
        </h3>

        <p>{trip.duration}</p>
      </div>

      {/* <div className="schedule-middle">
        <SeatIndicator
          seats={
            trip.availableSeats
          }
        />
      </div> */}

      <div className="schedule-right">
        <h4>
          ${trip.price} CAD
        </h4>

        <button
          className="schedule-buy-btn"
          onClick={() =>
            handleBooking(trip)
          }
          disabled={
            trip.availableSeats === 0
          }
        >
          {trip.availableSeats === 0
            ? "Fully Booked"
            : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default TripCard;