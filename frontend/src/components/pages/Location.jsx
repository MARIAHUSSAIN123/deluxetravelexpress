// Location.jsx

import React, { useContext } from "react";
import "./Location.css";

import car1 from "../../assets/car1.jpg";
import car2 from "../../assets/car2.jpg";
import car3 from "../../assets/car3.jpg";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import Footer from "./Footer";

const Location = () => {

  // LANGUAGE
  const { language } = useContext(LanguageContext);

  // TRANSLATIONS
  const t = translations[language] || translations.en;

  return (
<>
    <section className="locations-page">

      {/* HERO */}
      <div className="locations-hero">

        <div className="locations-overlay"></div>

        <div className="locations-content">

          <p className="location-tag">
            {t.locationTag}
          </p>

          <h1>
            {t.travel} <span>{t.locationsTitle}</span>
          </h1>

          <p className="location-desc">
            {t.locationDesc}
          </p>

        </div>

      </div>

      {/* LOCATIONS */}
      <div className="locations-container">

        {/* CARD 1 */}
        <div className="location-card">

          <div className="location-image">
            <img src={car1} alt="Calgary Downtown" />
          </div>

          <div className="location-info">

            <span className="location-number">
              01
            </span>

            <h2>{t.calgaryDowntown}</h2>

            <p className="main-text">
              {t.location1Text}
            </p>

            <div className="location-details">

              <div className="detail-box">

                <h4>{t.address}</h4>

                <p>
                  9th Ave SE, Calgary
                </p>

              </div>

              <div className="detail-box">

                <h4>{t.status}</h4>

                <p>
                  {t.activeRoute}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* CARD 2 */}
        <div className="location-card reverse">

          <div className="location-image">
            <img src={car2} alt="Calgary Airport" />
          </div>

          <div className="location-info">

            <span className="location-number">
              02
            </span>

            <h2>{t.yycAirport}</h2>

            <p className="main-text">
              {t.location2Text}
            </p>

            <div className="location-details">

              <div className="detail-box">

                <h4>{t.address}</h4>

                <p>
                  YYC
                </p>

              </div>

              <div className="detail-box">

                <h4>{t.status}</h4>

                <p>
                  {t.comingSoon}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* CARD 3 */}
        <div className="location-card">

          <div className="location-image">
            <img src={car3} alt="Edmonton Downtown" />
          </div>

          <div className="location-info">

            <span className="location-number">
              03
            </span>

            <h2>{t.edmontonDowntown}</h2>

            <p className="main-text">
              {t.location3Text}
            </p>

            <div className="location-details">

              <div className="detail-box">

                <h4>{t.address}</h4>

                <p>
                  Edmonton Downtown
                </p>

              </div>

              <div className="detail-box">

                <h4>{t.status}</h4>

                <p>
                  {t.activeRoute}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
    <Footer />
    </>
  );
};

export default Location;