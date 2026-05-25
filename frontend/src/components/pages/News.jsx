// News.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./News.css";

import {
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

import news1 from "../../assets/car1.jpg";
import news2 from "../../assets/car2.jpg";
import news3 from "../../assets/car3.jpg";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import Footer from "./Footer";

const News = () => {

  // LANGUAGE
  const { language } = useContext(LanguageContext);

  // TRANSLATIONS
  const t = translations[language] || translations.en;

  return (

    <>
    
      <section className="news-page">

        {/* ===== HERO ===== */}

        <div className="news-hero">

          <div className="news-overlay"></div>

          <div className="news-content">

            <span className="news-tag">
              {t.newsTag}
            </span>

            <h1>
              {t.latest} <span>{t.newsTitle}</span>
            </h1>

            <p>
              {t.newsDesc}
            </p>

          </div>

        </div>

        {/* ===== FEATURED NEWS ===== */}

        <div className="featured-news">

          <div className="featured-image">

            <img
              src={news1}
              alt="Featured News"
            />

          </div>

          <div className="featured-info">

            <span className="featured-date">

              <FaClock />

              {t.may2026}

            </span>

            <h2>
              {t.featuredNewsTitle}
            </h2>

            <p>
              {t.featuredNewsText}
            </p>

          <Link to="/news/1"> <button>

              {t.readMore}

              <FaArrowRight />

            </button></Link> 

          </div>

        </div>

        {/* ===== NEWS GRID ===== */}

        <div className="news-container">

          {/* ===== CARD 1 ===== */}

          <div className="news-card">

            <div className="news-image">

              <img
                src={news1}
                alt="news"
              />

            </div>

            <div className="news-info">

              <span className="news-date">

                <FaClock />

                {t.april2026}

              </span>

              <h3>
                {t.newsCard1Title}
              </h3>

              <p>
                {t.newsCard1Text}
              </p>

           <Link to="/news/2"><button>

                {t.readMore}

                <FaArrowRight />

              </button></Link>

            </div>

          </div>

          {/* ===== CARD 2 ===== */}

          <div className="news-card">

            <div className="news-image">

              <img
                src={news2}
                alt="news"
              />

            </div>

            <div className="news-info">

              <span className="news-date">

                <FaClock />

                {t.march2026}

              </span>

              <h3>
                {t.newsCard2Title}
              </h3>

              <p>
                {t.newsCard2Text}
              </p>

 <Link to="/news/3">    <button>

                {t.readMore}

                <FaArrowRight />

              </button></Link>

            </div>

          </div>

          {/* ===== CARD 3 ===== */}

          <div className="news-card">

            <div className="news-image">

              <img
                src={news3}
                alt="news"
              />

            </div>

            <div className="news-info">

              <span className="news-date">

                <FaClock />

                {t.feb2026}

              </span>

              <h3>
                {t.newsCard3Title}
              </h3>

              <p>
                {t.newsCard3Text}
              </p>

      <Link to="/news/4">       <button>

                {t.readMore}

                <FaArrowRight />

              </button></Link> 

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </>
  );
};

export default News;