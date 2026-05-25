import "./DailyReservations.css";
import { useState } from "react";

const DailyReservations = ({
  selectedRoute,
  trips,
  handleBooking,
}) => {

  const [selectedDate, setSelectedDate] =
    useState("");

  if (!selectedRoute) return null;

  const today = new Date();

  today.setMinutes(
    today.getMinutes() -
      today.getTimezoneOffset()
  );

  const minDate =
    today.toISOString().split("T")[0];

  return (
    <section className="daily-reservations">

      <div className="daily-top">

        <p className="daily-tag">
          DAILY RESERVATIONS
        </p>

        <h2>
          {selectedRoute.from}
          <span> → </span>
          {selectedRoute.to}
        </h2>

        {/* DATE SELECT FIRST */}

        <div
          style={{
            marginTop: "20px",
          }}
        >

          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Select Travel Date
          </label>

          <input
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        </div>
      </div>

      {/* USER MUST SELECT DATE */}

      {!selectedDate ? (

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Please select travel date first
        </div>

      ) : (

        <div className="daily-grid">

          {trips.map((trip) => {

            const soldOut =
              trip.availableSeats <= 0;

            return (
              <div
                className="reservation-card"
                key={trip.id}
              >

                <div className="trip-time">

                  <h3>
                    {trip.departure}
                    <span> → </span>
                    {trip.arrival}
                  </h3>

                  <p>
                    Duration:
                    {" "}
                    {trip.duration}
                  </p>

                  {/* SHOW SELECTED DATE */}

                  <p>
                    Travel Date:
                    {" "}
                    {selectedDate}
                  </p>
                </div>

                {/* LIVE SEATS */}

                <div className="trip-seats">

                  <span
                    className={
                      soldOut
                        ? "seat-badge sold"
                        : "seat-badge available"
                    }
                  >
                    {soldOut
                      ? "Sold Out"
                      : `${trip.availableSeats} Seats Remaining`}
                  </span>

                </div>

                {/* PRICE */}

                <div className="trip-price">

                  <h2>
                    ${trip.price}
                  </h2>

                  <p>CAD</p>
                </div>

                {/* BOOK BUTTON */}

                <button
                  disabled={soldOut}
                  className={
                    soldOut
                      ? "sold-btn"
                      : "book-btn"
                  }
                  onClick={() =>
                    handleBooking({
                      ...trip,
                      selectedDate,
                    })
                  }
                >

                  {soldOut
                    ? "SOLD OUT"
                    : "BUY TICKET"}

                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DailyReservations;