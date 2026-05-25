// RoutesPage.jsx

import React, { useContext } from "react";
import "./RoutesPage.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import Footer from "./Footer";


const Routes = () => {

  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;
    const navigate = useNavigate();

  const routes = [
    {
      title: `${t.calgary} → ${t.edmonton}`,
      trips: t.fourTripsDaily,
      status: "active",
      stops: [t.stop1, t.stop2, t.stop3, t.stop4, t.stop5],
    },
    {
      title: `${t.edmonton} → ${t.calgary}`,
      trips: t.fourTripsDaily,
      status: "active",
      stops: [t.stop6, t.stop7, t.stop8, t.stop9, t.stop10],
    },
    {
      title: `${t.toronto} → ${t.ottawa}`,
      trips: t.twoTripsDaily,
      status: "coming",
      stops: [t.availableSoon],
    },
    {
      title: `${t.ottawa} → ${t.toronto}`,
      trips: t.twoTripsDaily,
      status: "coming",
      stops: [t.availableSoon],
    },
    {
      title: `${t.calgary} → Vancouver`,
      trips: t.comingLater,
      status: "locked",
      stops: [t.stop11],
    },
  ];

  return (
    <>                        {/* ← fragment add kiya */}
      <section className="routes-section">

        <div className="routes-top">

          <p className="routes-tag">
            {t.routesTag}
          </p>

          <h1>
            {t.routesHeading1}
            <br />
            {t.routesHeading2}
          </h1>

        </div>

        <div className="routes-grid">

          {routes.map((route, index) => (

            <div
              className={`route-card ${route.status}`}
              key={index}
            >

              <div className="route-header">

                <div>
                  <span className="route-number">0{index + 1}</span>
                  <h2>{route.title}</h2>
                </div>

                <span className="trip-badge">
                  {route.trips}
                </span>

              </div>

              <ul className="route-stops">
                {route.stops.map((stop, i) => (
                  <li key={i}>{stop}</li>
                ))}
              </ul>

              {route.status === "coming" && (
                <button className="coming-btn">{t.comingSoon}</button>
              )}

              {route.status === "locked" && (
                <button className="locked-btn">{t.routeLocked}</button>
              )}

             {route.status === "active" && (
  <button className="book-btn" onClick={() => navigate('/ticket')}>
    {t.bookNowBtn}
  </button>
)}

            </div>

          ))}

        </div>

      </section>

      <Footer />              {/* ← footer add kiya */}
    </>
  );
};

export default Routes;