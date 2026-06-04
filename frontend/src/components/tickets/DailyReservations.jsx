import "./DailyReservations.css";
import { useState, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const DailyReservations = ({ selectedRoute, trips, handleSelectTrip }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const [selectedDate, setSelectedDate] = useState("");

  if (!selectedRoute) return null;

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDate = today.toISOString().split("T")[0];

  return (
    <section className="daily-reservations">
      <div className="daily-top">
        <p className="daily-tag">{t.dailyTag}</p>
        <h2>
          {selectedRoute.from}
          <span> → </span>
          {selectedRoute.to}
        </h2>

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>
            {t.selectTravelDate}
          </label>
          <input
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ccc", width: "250px" }}
          />
        </div>
      </div>

      {!selectedDate ? (
        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "18px", fontWeight: "600" }}>
          {t.selectDateFirst}
        </div>
      ) : (
        <div className="daily-grid">
          {trips.map((trip) => {
            const soldOut = trip.availableSeats <= 0;
            return (
              <div className="reservation-card" key={trip.id}>

                <div className="trip-time">
                  <h3>{trip.departure}<span> → </span>{trip.arrival}</h3>
                  <p>{t.duration}: {trip.duration}</p>
                  <p>{t.travelDate}: {selectedDate}</p>
                </div>

                <div className="trip-seats">
                  <span className={soldOut ? "seat-badge sold" : "seat-badge available"}>
                    {soldOut ? t.soldOut : `${trip.availableSeats} ${t.seatsRemaining}`}
                  </span>
                </div>

                <div className="trip-price">
                  <h2>${trip.price}</h2>
                  <p>CAD</p>
                </div>

                <button
                  disabled={soldOut}
                  className={soldOut ? "sold-btn" : "book-btn"}
                  onClick={() => handleSelectTrip(trip, selectedDate)}
                >
                  {soldOut ? t.soldOut : t.buyTicket}
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
