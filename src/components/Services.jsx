import React, { useContext } from "react";
import "./Services.css";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
const navigate= useNavigate();
  // LANGUAGE
  const { language } = useContext(LanguageContext);

  return (

    <section className="services-section">

      {/* HEADER */}
      <div className="services-header">

        <h2>
          {language === "en"
            ? "Luxury Travel Services"
            : "Services de voyage de luxe"}
        </h2>

        <p className="services-subtitle">

          {language === "en"

            ? "Travel beyond ordinary with Deluxe Travel Express. We provide premium SUV transportation with Cadillac Escalade and Infiniti QX80, ensuring comfort, reliability, and a smooth journey across major Canadian cities."

            : "Voyagez au-delà de l’ordinaire avec Deluxe Travel Express. Nous proposons un transport SUV premium avec Cadillac Escalade et Infiniti QX80, garantissant confort, fiabilité et voyages fluides entre les grandes villes canadiennes."}

        </p>

        <div className="gold-line"></div>

      </div>

      {/* GRID */}
      <div className="services-grid">

        {/* CARD 1 */}
        <div className="service-card">

          <div className="service-overlay"></div>

          <h3>
            Calgary → Edmonton
          </h3>

          <p>

            {language === "en"

              ? "Daily luxury SUV transfers with multiple departures, offering a comfortable and reliable journey between cities."

              : "Transferts SUV de luxe quotidiens avec plusieurs départs, offrant un voyage confortable et fiable entre les villes."}

          </p>

          <div className="service-footer">

            <span>
              {language === "en"
                ? "4 Trips / Day"
                : "4 trajets / jour"}
            </span>

         <button
  onClick={() => window.location.href = "/ticket"}
>
  {language === "en"
    ? "Book Now"
    : "Réserver"}
</button>

          </div>

        </div>

        {/* CARD 2 */}
        <div className="service-card">

          <div className="service-overlay"></div>

          <h3>
            Edmonton → Calgary
          </h3>

          <p>

            {language === "en"

              ? "Premium return trips with spacious interiors, professional drivers, and a first-class travel experience."

              : "Voyages retour premium avec intérieurs spacieux, chauffeurs professionnels et expérience de voyage haut de gamme."}

          </p>

          <div className="service-footer">

            <span>
              {language === "en"
                ? "4 Trips / Day"
                : "4 trajets / jour"}
            </span>

          <button
  onClick={() => window.location.href = "/ticket"}
>
  {language === "en"
    ? "Book Now"
    : "Réserver"}
</button>

          </div>

        </div>

        {/* CARD 3 */}
        <div className="service-card">

          <div className="service-overlay"></div>

          <h3>
            Toronto → Ottawa
          </h3>

          <p>

            {language === "en"

              ? "Upcoming luxury routes designed for smooth, safe, and stylish intercity travel."

              : "Nouvelles routes de luxe à venir pour des voyages interurbains élégants, sûrs et confortables."}

          </p>

          <div className="service-footer">

            <span>
              {language === "en"
                ? "2 Trips / Day"
                : "2 trajets / jour"}
            </span>

         <button
  onClick={() => window.location.href = "/ticket"}
>
  {language === "en"
    ? "Book Now"
    : "Réserver"}
</button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Services;