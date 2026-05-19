// SchedulePage.jsx

import React, {
  useState,
  useContext,
} from "react";

import car1 from "../assets/view1.jpg";
import car2 from "../assets/view2.jpg";
import car4 from "../assets/ottawa.jpg";
import car5 from "../assets/toronto.jpg";
import car6 from "../assets/banff.jpg";
import car3 from "../assets/ottawa2.jpg";

import {
  LanguageContext,
} from "../context/LanguageContext";

import translations from "../translations";

import "./SchedulePage.css";

const SchedulePage = () => {

  const { language } =
    useContext(LanguageContext);

  const t =
    translations[language];

  const [activeModal, setActiveModal] =
    useState(null);

  // ROUTES
  const routes = [

    // CALGARY → EDMONTON
    {
      from: "Calgary",
      to: "Edmonton",

      times: [
        "07:00 AM",
        "12:00 PM",
        "05:00 PM",
      ],

      bgImage: car1,

      carImages: [
        {
          name: "Cadillac Escalade",
          url: "https://i.pinimg.com/236x/93/05/b5/9305b538948b69640d04c377da2c68c6.jpg",
        },

        {
          name: "GMC Yukon",
          url: "https://i.pinimg.com/1200x/b4/16/8b/b4168b529d4d1196bb95c887f358cef7.jpg",
        },

        {
          name: "Infiniti QX80",
          url: "https://i.pinimg.com/236x/a8/d1/90/a8d1903cb138c6b789b87d12419f972c.jpg",
        },
      ],

      schedule: [
        {
          station:
            "Calgary – Marlborough Mall",

          arrival: "—",

          departure: "06:30 AM",

          address:
            "433 Marlborough Way NE, Calgary, AB T2A 5H5",
        },

        {
          station:
            "Calgary – Downtown 4 Ave SE",

          arrival: "06:50 AM",

          departure: "06:50 AM",

          address:
            "220 4 Ave SE, Calgary, AB T2G 4X3",
        },

        {
          station:
            "Calgary – Westbrook Mall",

          arrival: "07:15 AM",

          departure: "07:15 AM",

          address:
            "1200 37 St SW, Calgary, AB T3C 1S5",
        },

        {
          station:
            "Calgary – North",

          arrival: "07:45 AM",

          departure: "07:45 AM",

          address:
            "1110 Panatella Blvd NW Unit 430, Calgary, AB",
        },

        {
          station: "Red Deer",

          arrival: "09:20 AM",

          departure: "09:20 AM",

          address:
            "6607 67 St, Red Deer, AB T4P 1A4",
        },

        {
          station:
            "Petro-Canada by YEG",

          arrival: "10:35 AM",

          departure: "10:35 AM",

          address:
            "307 Airport Rd., Edmonton, AB T9E 0V5",
        },

        {
          station:
            "Edmonton South",

          arrival: "11:05 AM",

          departure: "11:05 AM",

          address:
            "Edmonton Southgate Transit Center, Edmonton, AB T6H 3G4",
        },

        {
          station:
            "Edmonton Downtown",

          arrival: "11:35 AM",

          departure: "—",

          address:
            "10180 105 St NW, Edmonton, AB T5J 1E1",
        },
      ],
    },

    // EDMONTON → CALGARY
    {
      from: "Edmonton",
      to: "Calgary",

      times: [
        "08:00 AM",
        "01:00 PM",
        "06:00 PM",
      ],

      bgImage: car2,

      carImages: [
        {
          name: "Cadillac Escalade",
          url: "https://i.pinimg.com/1200x/c6/f9/1e/c6f91e1617454d1c57ea8c195386a7a4.jpg",
        },

        {
          name: "GMC Yukon",
          url: "https://i.pinimg.com/736x/c8/06/b3/c806b3a07559186ab12e3b400b37eafb.jpg",
        },

        {
          name: "Infiniti QX80",
          url: "https://i.pinimg.com/736x/69/39/44/693944a4a5a0fd02d85da2942ad9ae90.jpg",
        },
      ],

      schedule: [
        {
          station:
            "Edmonton Downtown",

          arrival: "—",

          departure: "08:00 AM",

          address:
            "10180 105 St NW, Edmonton, AB T5J 1E1",
        },

        {
          station:
            "Edmonton South",

          arrival: "08:25 AM",

          departure: "08:25 AM",

          address:
            "Edmonton Southgate Transit Center, Edmonton, AB T6H 3G4",
        },

        {
          station:
            "Petro-Canada by YEG",

          arrival: "08:50 AM",

          departure: "08:50 AM",

          address:
            "307 Airport Rd., Edmonton, AB T9E 0V5",
        },

        {
          station: "Red Deer",

          arrival: "10:10 AM",

          departure: "10:10 AM",

          address:
            "6607 67 St, Red Deer, AB T4P 1A4",
        },

        {
          station:
            "Calgary – North",

          arrival: "11:45 AM",

          departure: "11:45 AM",

          address:
            "1110 Panatella Blvd NW Unit 430, Calgary, AB",
        },

        {
          station:
            "Calgary – Westbrook Mall",

          arrival: "12:15 PM",

          departure: "12:15 PM",

          address:
            "1200 37 St SW, Calgary, AB T3C 1S5",
        },

        {
          station:
            "Calgary – Downtown 4 Ave SE",

          arrival: "12:40 PM",

          departure: "12:40 PM",

          address:
            "220 4 Ave SE, Calgary, AB T2G 4X3",
        },

        {
          station:
            "Calgary – Marlborough Mall",

          arrival: "01:00 PM",

          departure: "—",

          address:
            "433 Marlborough Way NE, Calgary, AB T2A 5H5",
        },
      ],
    },

   // TORONTO → OTTAWA (ACTIVE)
{
  from: "Toronto",
  to: "Ottawa",

  times: [
    "09:00 AM",
    "04:00 PM",
  ],

  bgImage: car3,

carImages: [
  {
    name: "Cadillac Escalade",
    url: "https://i.pinimg.com/1200x/e1/86/f1/e186f11690989b4f763cc81adaaeb37c.jpg",
  },
  {
    name: "GMC Yukon",
    url: "https://i.pinimg.com/236x/39/1e/1b/391e1b4e31093ed04a03f2c3dd689d95.jpg",
  },
  {
    name: "Infiniti QX80",
    url: "https://i.pinimg.com/736x/69/39/44/693944a4a5a0fd02d85da2942ad9ae90.jpg",
  },
],


  schedule: [
    {
      station:
        "Toronto – Downtown",

      arrival: "—",

      departure:
        "09:00 AM",

      address:
        "Toronto, ON",
    },

    {
      station:
        "Ottawa – Downtown",

      arrival:
        "01:30 PM",

      departure: "—",

      address:
        "Ottawa, ON",
    },
  ],
},

// BANFF → CALGARY (COMING SOON)
{
  from: "Banff",
  to: "Calgary",

  times: [
    "Coming Soon",
  ],

  bgImage: car5,

  comingSoon: true,

  carImages: [
  {
    name: "Cadillac Escalade",
    url: "https://i.pinimg.com/1200x/05/8c/24/058c24cce35349e60ad301b599281812.jpg",
  },
  {
    name: "GMC Yukon",
    url: "https://i.pinimg.com/1200x/60/fb/87/60fb87a63d762f90089e7761b1ead937.jpg",
  },
  {
    name: "Infiniti QX80",
    url: "https://i.pinimg.com/736x/69/39/44/693944a4a5a0fd02d85da2942ad9ae90.jpg",
  },
],

  schedule: [
    {
      station:
        "Banff Downtown",

      arrival: "—",

      departure:
        "Coming Soon",

      address:
        "Coming Soon",
    },

    {
      station:
        "Canmore",

      arrival:
        "Coming Soon",

      departure:
        "Coming Soon",

      address:
        "Coming Soon",
    },

    {
      station:
        "Calgary Downtown",

      arrival:
        "Coming Soon",

      departure: "—",

      address:
        "Coming Soon",
    },
  ],
},

// CALGARY → BANFF (COMING SOON)
{
  from: "Calgary",
  to: "Banff",

  times: [
    "Coming Soon",
  ],

  bgImage: car6,

  comingSoon: true,

carImages: [
        {
          name: "Cadillac Escalade",
          url: "https://i.pinimg.com/1200x/c6/f9/1e/c6f91e1617454d1c57ea8c195386a7a4.jpg",
        },

        {
          name: "GMC Yukon",
          url: "https://i.pinimg.com/736x/c8/06/b3/c806b3a07559186ab12e3b400b37eafb.jpg",
        },

        {
          name: "Infiniti QX80",
          url: "https://i.pinimg.com/736x/73/c9/e0/73c9e096d13f4a9928b81f8c386347d1.jpg",
        },
      ],
  schedule: [
    {
      station:
        "Calgary Downtown",

      arrival: "—",

      departure:
        "Coming Soon",

      address:
        "Coming Soon",
    },

    {
      station:
        "Canmore",

      arrival:
        "Coming Soon",

      departure:
        "Coming Soon",

      address:
        "Coming Soon",
    },

    {
      station:
        "Banff Downtown",

      arrival:
        "Coming Soon",

      departure: "—",

      address:
        "Coming Soon",
    },
  ],
},

// OTTAWA → TORONTO (COMING SOON)
{
  from: "Ottawa",
  to: "Toronto",

  times: [
    "Coming Soon",
  ],

  bgImage: car4,

  comingSoon: true,

 carImages: [
        {
          name: "Cadillac Escalade",
          url: "https://i.pinimg.com/236x/93/05/b5/9305b538948b69640d04c377da2c68c6.jpg",
        },

        {
          name: "GMC Yukon",
          url: "https://i.pinimg.com/1200x/25/f9/e8/25f9e86d122933b55c21dd5101928230.jpg",
        },

        {
          name: "Infiniti QX80",
          url: "https://i.pinimg.com/236x/a8/d1/90/a8d1903cb138c6b789b87d12419f972c.jpg",
        },
      ],

  schedule: [
    {
      station:
        "Ottawa – Downtown",

      arrival: "—",

      departure:
        "Coming Soon",

      address:
        "Coming Soon",
    },

    {
      station:
        "Toronto – Downtown",

      arrival:
        "Coming Soon",

      departure: "—",

      address:
        "Coming Soon",
    },
  ],
},
  ]
  return (
    <section className="schedule-section">

      {/* HEADER */}
      <div className="section-header">

        <h2>
          {t.carSchedules}
        </h2>

        <p className="luxury-subtitle">
          {t.scheduleSubtitle}
        </p>

        <div className="header-line"></div>

      </div>

      {/* CARDS */}
      <div className="schedule-list">
        {routes.map((route, index) => (

          <div
            className="schedule-card-wrapper"
            key={index}
          >

            <div
              className="card-image-box"
              style={{
                backgroundImage:
                  `url(${route.bgImage})`,
              }}
            >

              <div className="image-overlay"></div>

              {route.comingSoon && (
                <div className="coming-soon-badge">
                  COMING SOON
                </div>
              )}

            </div>

            <div className="card-content-bottom">

              <h3 className="route-pill-box">
                {route.from} / {route.to}
              </h3>

              <p className="sub-text">
                {t.inBetween}
              </p>

              <div className="timing-grid">

                {route.times.map(
                  (time, i) => (

                    <span
                      className="time-tag"
                      key={i}
                    >
                      {time}
                    </span>

                  )
                )}

              </div>

              <button
                className="rider-btn-details"
                onClick={() =>
                  setActiveModal(index)
                }
              >
                {t.viewDetails}
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {activeModal !== null && (

        <div
          className="modal-overlay"
          onClick={() =>
            setActiveModal(null)
          }
        >

          <div
            className="modal-box"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}
            <div className="modal-header">

              <div>

                <p className="modal-tag">
                  {language === "fr"
                    ? "HORAIRE DÉTAILLÉ"
                    : "DETAILED SCHEDULE"}
                </p>

                <h2 className="modal-title">

                  {
                    routes[activeModal]
                      .from
                  }

                  {" → "}

                  {
                    routes[activeModal]
                      .to
                  }

                </h2>

                <p className="modal-subtitle">

                  {routes[activeModal]
                    .comingSoon
                    ? "Coming Soon Route"
                    : "Everyday Service · Daily"}

                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setActiveModal(null)
                }
              >
                ✕
              </button>

            </div>

            {/* CARS */}
       {/* CARS */}
<div className="modal-cars">

  <p className="modal-cars-title">
    {language === "fr"
      ? "Nos Véhicules de Luxe"
      : "Our Luxury Vehicles"}
  </p>

  <div className="modal-cars-grid">

    {routes[activeModal].carImages.map(
      (car, i) => (

        <div
          className="modal-car-card"
          key={i}
        >

          <img
            src={car.url}
            alt={car.name}
            className="modal-car-img"

            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/500x300?text=Luxury+Vehicle";
            }}
          />

          <p className="modal-car-name">
            {car.name}
          </p>

        </div>

      )
    )}

  </div>

</div>

            {/* TABLE */}
            <div className="modal-table-wrap">

              <table className="modal-table">

                <thead>

                  <tr>

                    <th>
                      Station
                    </th>

                    <th>
                      Arrival
                    </th>

                    <th>
                      Departure
                    </th>

                    <th>
                      Address
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {routes[
                    activeModal
                  ].schedule.map(
                    (row, i) => (

                      <tr key={i}>

                        <td className="station-name">
                          {row.station}
                        </td>

                        <td className="time-cell">
                          {row.arrival}
                        </td>

                        <td className="time-cell">
                          {row.departure}
                        </td>

                        <td className="address-cell">
                          {row.address}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default SchedulePage;