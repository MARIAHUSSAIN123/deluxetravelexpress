import "./RouteCard.css";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const RouteCard = ({ from, to, price, trips, duration, image, disabled, openSchedules }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  return (
    <div className="route-card">
      <img src={image} alt={`${from} to ${to}`} className="route-card-img" />
      <div className="route-overlay"></div>
      <div className="route-card-content">

        <h2>{from} <span>→</span> {to}</h2>
        <h3>${price} CAD</h3>

        <div className="route-times">
          {trips.map((time, index) => (
            <p key={index} className="trip-time">🚗 {time}</p>
          ))}
        </div>

        <div className="route-info">
          <p>⏱ {duration}</p>
        </div>

        {disabled ? (
          <button className="coming-btn">{t.comingSoon}</button>
        ) : (
          <button className="route-btn" onClick={() => openSchedules(from, to)}>
            {t.viewSchedules}
          </button>
        )}

      </div>
    </div>
  );
};

export default RouteCard;