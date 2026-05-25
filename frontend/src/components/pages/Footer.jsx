// Footer.jsx

import React, { useContext } from "react";
import "./Footer.css";

import {
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

function Footer() {

  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.en;

  return (

    <footer className="footer">

      <div className="footer-overlay"></div>

      <div className="footer-container">

        {/* LEFT */}

        <div className="footer-box footer-brand">

          <span className="footer-mini-title">
            PREMIUM LUXURY TRANSPORT
          </span>

          <h1>
            DELUXE TRAVEL EXPRESS
          </h1>

          <p>
            {t.footerAboutText}
          </p>

          <button className="footer-btn">

            {t.learnMore}

            <FaArrowRight />

          </button>

        </div>

        {/* CENTER */}

        <div className="footer-box">

          <h2>{t.quickLinks}</h2>

          <ul className="footer-links">

            <li>{t.bookTickets}</li>

            <li>{t.routes}</li>

            <li>{t.locations}</li>

            <li>{t.freightServices}</li>

            <li>{t.faq}</li>

          </ul>

        </div>

        {/* RIGHT */}

        <div className="footer-box">

          <h2>{t.contactUs}</h2>

          <div className="footer-contact">

            <p>
              <FaEnvelope />
              info@deluxetravelexpress.com
            </p>

            <p>
              <FaPhoneAlt />
              +1 403 458 0219
            </p>

            <p>
              <FaMapMarkerAlt />
              Calgary, Alberta, Canada
            </p>

          </div>

          <div className="social-icons">

            <a href="/">
              <FaFacebookF />
            </a>

            <a href="/">
              <FaInstagram />
            </a>

          </div>

        </div>

      </div>

      {/* BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 Deluxe Travel Express. {t.rightsReserved}
        </p>

      </div>

    </footer>
  );
}

export default Footer;