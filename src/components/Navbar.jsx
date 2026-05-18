import React, { useState, useContext } from "react";
import logo from "../assets/logo deluxe.png";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import translations from "../translations";
import { LanguageContext } from "../context/LanguageContext";
import "./Navbar.css";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo" />
      </div>

      {/* MENU */}
      <ul className={menuOpen ? "nav-center active" : "nav-center"}>

        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            {t.home}
          </Link>
        </li>

        <li>
          <Link to="/AboutUs" onClick={() => setMenuOpen(false)}>
            {t.about}
          </Link>
        </li>

        <li>
          <Link to="/routes" onClick={() => setMenuOpen(false)}>
            {t.routes}
          </Link>
        </li>

        <li>
          <Link to="/location" onClick={() => setMenuOpen(false)}>
            {t.locations}
          </Link>
        </li>

        <li>
          <Link to="/news" onClick={() => setMenuOpen(false)}>
            {t.news}
          </Link>
        </li>

        <li>
          <Link to="/faq" onClick={() => setMenuOpen(false)}>
            {t.faq}
          </Link>
        </li>

        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            {t.contact}
          </Link>
        </li>

      </ul>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* TICKETS BUTTON ← new */}
        <Link to="/ticket" className="tickets-btn">
          {language === "fr" ? "Billets" : "Tickets"}
        </Link>

        {/* LANGUAGE SWITCHER */}
        <div className="language-switcher">
          <button
            className="lang-btn"
            onClick={() =>
              setLanguage(language === "en" ? "fr" : "en")
            }
          >
            {language === "en" ? "FR" : "EN"}
          </button>
        </div>

        {/* SIGNUP BUTTON */}
        <Link to="/signup" className="signup-btn">
          {t.signup}
        </Link>

      </div>

      {/* MOBILE TOGGLE */}
      <div
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

    </nav>
  );
};

export default Navbar;