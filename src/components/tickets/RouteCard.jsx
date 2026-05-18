import "./RouteCard.css";

const RouteCard = ({
  from,
  to,
  price,
  trips,
  duration,
  image,
  disabled,
  openSchedules,
}) => {
  return (
    <div className="route-card">
      
      {/* IMAGE */}
      <img
        src={image}
        alt={`${from} to ${to}`}
        className="route-card-img"
      />

      {/* OVERLAY */}
      <div className="route-overlay"></div>

      {/* CONTENT */}
      <div className="route-card-content">
        <h2>
          {from} <span>→</span> {to}
        </h2>

        <h3>${price} CAD</h3>

        <div className="route-info">
          <p>🚌 {trips}</p>
          <p>⏱ {duration}</p>
        </div>

        {disabled ? (
          <button className="coming-btn">
            Coming Soon
          </button>
        ) : (
          <button
            className="route-btn"
            onClick={() =>
              openSchedules(from, to)
            }
          >
            VIEW SCHEDULES
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteCard;