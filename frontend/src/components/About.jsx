import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./About.css";
import { LanguageContext } from "../context/LanguageContext";
import translations from "../translations";

const About = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  return (
    <section className="about">
      <div className="about-wrapper">

        {/* LEFT SIDE */}
        <div className="about-content">

          <span className="about-mini">
            {t.aboutTag}
          </span>

          <h2>
            {t.aboutHeading}
          </h2>

          <p>{t.aboutText1}</p>
          <p>{t.aboutText2}</p>
          <p>{t.aboutText3}</p>

          <Link to="/routes" className="about-btn">
            {t.exploreRoutesBtn}
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="about-cards">

          <div className="card">
            <div className="card-number">01</div>
            <h3>{t.aboutCard1Title}</h3>
            <p>{t.aboutCard1Text}</p>
          </div>

          <div className="card">
            <div className="card-number">02</div>
            <h3>{t.aboutCard2Title}</h3>
            <p>{t.aboutCard2Text}</p>
          </div>

          <div className="card">
            <div className="card-number">03</div>
            <h3>{t.aboutCard3Title}</h3>
            <p>{t.aboutCard3Text}</p>
          </div>

          <div className="card">
            <div className="card-number">04</div>
            <h3>{t.aboutCard4Title}</h3>
            <p>{t.aboutCard4Text}</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
