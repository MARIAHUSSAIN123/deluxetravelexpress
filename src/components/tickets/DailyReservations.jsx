import "./DailyReservations.css";

const DailyReservations = ({
  selectedRoute,
  trips,
  handleBooking,
}) => {
  if (!selectedRoute) return null;

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

      </div>

      <div className="daily-grid">

        {trips.map((trip) => {

          const soldOut =
            trip.availableSeats <= 0;

          return (
            <div
              className="reservation-card"
              key={trip.id}
            >

              <div className="reservation-left">

                <h3>
                  {trip.departure}
                  <span> → </span>
                  {trip.arrival}
                </h3>

                <p>
                  {trip.duration}
                </p>

              </div>

              <div className="reservation-middle">

                <h4>
                  {soldOut
                    ? "Sold Out"
                    : `${trip.availableSeats} Seats Left`}
                </h4>

              </div>

              <div className="reservation-right">

                <h2>
                  ${trip.price} CAD
                </h2>

                <button
                  disabled={soldOut}
                  className={
                    soldOut
                      ? "sold-btn"
                      : "book-btn"
                  }
                  onClick={() =>
                    handleBooking(trip)
                  }
                >
                  {soldOut
                    ? "SOLD OUT"
                    : "BUY TICKET"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default DailyReservations;