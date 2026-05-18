// Contact.jsx

import React, { useContext } from "react";

import "./Contact.css";
import Footer from "./Footer";

import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const offices = [
  {
    id: 1,
    title: "Calgary Westbrook Mall Office",
    address:
      "Westbrook Mall Unit 46, 1200 37 St SW, Calgary, AB, Canada, T3C 1S2",

    email: "",

    hours: [
      "Monday: 7:30 A.M - 4:30 P.M",
      "Tuesday: 7:30 A.M - 4:30 P.M",
      "Wednesday: 7:30 A.M - 4:30 P.M",
      "Thursday: 7:30 A.M - 4:30 P.M",
      "Friday: 7:30 A.M - 4:30 P.M",
      "Saturday: 7:30 A.M - 5:00 P.M",
    ],
  },

  {
    id: 2,
    title: "Calgary Marlborough Mall Office",

    address:
      "1457 3800 Memorial Dr NE, Calgary, AB, Canada, T2A 2K2",

    email: "contact@deluxetravelexpress.com",

    hours: [
      "Monday: 7:00 A.M - 4:00 P.M",
      "Tuesday: 7:00 A.M - 4:00 P.M",
      "Wednesday: 7:00 A.M - 4:00 P.M",
      "Thursday: 7:00 A.M - 4:00 P.M",
      "Friday: 7:00 A.M - 4:00 P.M",
      "Saturday: 7:00 A.M - 4:15 P.M",
      "Sunday: 7:00 A.M - 4:15 P.M",
    ],
  },

  {
    id: 3,

    title: "Regina Office",

    address:
      "2820 C Avonhurst Dr, Regina S4R 3J5",

    email: "contact@deluxetravelexpress.com",

    hours: [
      "Monday: 8:30 A.M - 4:00 P.M",
      "Tuesday: 8:30 A.M - 4:00 P.M",
      "Wednesday: 8:30 A.M - 4:00 P.M",
      "Thursday: 8:30 A.M - 4:00 P.M",
      "Friday: 8:30 A.M - 1:00 P.M",
      "Saturday: 8:00 A.M - 12:00 P.M",
    ],
  },
];

function Contact() {

  // LANGUAGE
  const { language } = useContext(LanguageContext);

  // TRANSLATIONS
const t = translations[language] || translations.en;

  return (
    <>

      {/* HERO */}
      <div className="contact-hero">

        <h1>
          {t.contactHero}
        </h1>

      </div>

      {/* OFFICE CARDS */}
      <div className="contact-container">

        {offices.map((office) => (

          <div
            className="office-card"
            key={office.id}
          >

            <div className="office-top">

              <div className="office-number">
                {office.id}
              </div>

              <div>

                <h2>
                  {office.title}
                </h2>

                <p className="office-info">

                  <FaMapMarkerAlt className="icon" />

                  {office.address}

                </p>

                <p className="office-info">

                  <FaEnvelope className="icon" />

                  {office.email}

                </p>

              </div>

            </div>

            <div className="hours-section">

              <h3>
                {t.officeHours}
              </h3>

              {office.hours.map((hour, index) => (

                <p key={index}>
                  {hour}
                </p>

              ))}

            </div>

          </div>

        ))}

      </div>

    <Footer />

    </>
  );
}

export default Contact;