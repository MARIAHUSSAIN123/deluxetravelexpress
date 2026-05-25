import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "./AboutUs.css";

import luxuryCar from "../../assets/person1.jpg";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const AboutUs = () => {

  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  return (
    <>                          {/* ← fragment add kiya */}
      <section className="about-section">

        <div className="about-container">

          {/* LEFT CONTENT */}
          <div className="about-left">

            <span className="about-tag">
              {t.aboutTag}
            </span>

            <h2>
              Deluxe Travel Express
            </h2>

            <p>{t.aboutText1}</p>

            <p>{t.aboutText2}</p>
<Link to="/routes" className="about-btn">
  {t.exploreRoutesBtn}
</Link>

          </div>

          {/* CENTER IMAGE */}
          <div className="about-image">
            <img src={luxuryCar} alt="Luxury SUV" />
          </div>

          {/* RIGHT CARDS */}
          <div className="about-right">

            <div className="about-card">
              <h3>{t.premiumVehicles}</h3>
              <p>{t.premiumVehiclesText}</p>
            </div>

            <div className="about-card">
              <h3>{t.reliableService}</h3>
              <p>{t.reliableServiceText}</p>
            </div>

            <div className="about-card">
              <h3>{t.flexibleRoutes}</h3>
              <p>{t.flexibleRoutesText}</p>
            </div>

          </div>

        </div>

      </section>

      <Footer />                {/* ← footer add kiya */}
    </>
  );
};

export default AboutUs;