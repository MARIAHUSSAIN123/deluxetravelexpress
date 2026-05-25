// Faq.jsx

import React, { useState, useContext } from "react";
import Footer from "./Footer";
import "./Faq.css";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

const Faq = () => {

  // LANGUAGE
  const { language } = useContext(LanguageContext);

  // TRANSLATIONS
  const t = translations[language] || translations.en;

  // FAQ DATA
  const faqData = [
    {
      question: t.faqQ1,
      answer: t.faqA1,
    },

    {
      question: t.faqQ2,
      answer: t.faqA2,
    },

    {
      question: t.faqQ3,
      answer: t.faqA3,
    },

    {
      question: t.faqQ4,
      answer: t.faqA4,
    },

    {
      question: t.faqQ5,
      answer: t.faqA5,
    },

    {
      question: t.faqQ6,
      answer: t.faqA6,
    },
  ];

  // ACTIVE FAQ
  const [activeIndex, setActiveIndex] = useState(null);

  // TOGGLE
  const toggleFaq = (index) => {
    setActiveIndex(
      activeIndex === index ? null : index
    );
  };

return (
    <>
      <section className="faq-page">

        <div className="faq-top">
          <h1>{t.faqTitle}</h1>
        </div>

        <div className="faq-container">

          {faqData.map((item, index) => (

            <div
              className={`faq-card ${activeIndex === index ? "active" : ""}`}
              key={index}
            >

              <div
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <h3>{item.question}</h3>
                <span>{activeIndex === index ? "−" : "+"}</span>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}

            </div>

          ))}

        </div>

      </section>

      <Footer />       {/* ← sahi hai, </Footer /> nahi */}
    </>
  );
  }; 
  export default Faq;