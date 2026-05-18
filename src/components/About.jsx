import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <section className="about">

      <div className="about-wrapper">

        {/* LEFT SIDE */}
        <div className="about-content">

          <span className="about-mini">
            PREMIUM INTERCITY EXPERIENCE
          </span>

          <h2>
            Experience Luxury <br />
            Beyond The Journey
          </h2>

          <p>
            Deluxe Travel Express delivers a refined travel experience
            for passengers who value comfort, elegance, and reliability.
            Every trip is carefully designed to make long-distance travel
            feel smooth, relaxing, and stress-free.
          </p>

          <p>
            Our premium SUV fleet combines luxury interiors, spacious
            seating, and modern amenities with professional chauffeur
            service — creating a first-class experience from departure
            to destination.
          </p>

          <p>
            Whether you're traveling for business or leisure, we ensure
            every mile reflects the quality, sophistication, and care
            that define Deluxe Travel Express.
          </p>
 <Link to="/routes" className="about-btn">
            Explore Routes
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="about-cards">

          <div className="card">
            <div className="card-number">01</div>

            <h3>Luxury SUV Fleet</h3>

            <p>
              Premium vehicles with spacious seating,
              elegant interiors, and advanced comfort
              features for a superior journey.
            </p>
          </div>

          <div className="card">
            <div className="card-number">02</div>

            <h3>Professional Chauffeurs</h3>

            <p>
              Experienced drivers committed to safe,
              smooth, and punctual travel with
              exceptional customer care.
            </p>
          </div>

          <div className="card">
            <div className="card-number">03</div>

            <h3>Reliable Scheduling</h3>

            <p>
              Consistent and dependable departures
              designed to keep your travel experience
              convenient and stress-free.
            </p>
          </div>

          <div className="card">
            <div className="card-number">04</div>

            <h3>Modern Travel Comfort</h3>

            <p>
              Enjoy a peaceful atmosphere with
              refined interiors, smooth rides,
              and premium onboard comfort.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};

export default About;