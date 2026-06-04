import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.en;

  const newsData = {
    1: {
      title: t.featuredNewsTitle,
      date: t.may2026,
      desc: t.featuredNewsFullDesc,
      image: "https://i.pinimg.com/1200x/3f/b2/9f/3fb29f0f32da1bdecff7b6c881a79fc9.jpg",
    },
    2: {
      title: t.newsCard1Title,
      date: t.april2026,
      desc: t.newsCard1FullDesc,
      image: "https://i.pinimg.com/736x/26/f0/ce/26f0ced629a60a17c08b7d55ce882be3.jpg",
    },
    3: {
      title: t.newsCard2Title,
      date: t.march2026,
      desc: t.newsCard2FullDesc,
      image: "https://i.pinimg.com/1200x/69/9a/5f/699a5ff83b850b255e088f305fa91d30.jpg",
    },
    4: {
      title: t.newsCard3Title,
      date: t.feb2026,
      desc: t.newsCard3FullDesc,
      image: "https://i.pinimg.com/1200x/91/c3/24/91c324456cf8698f53fbaba83e506471.jpg",
    },
  };

  const news = newsData[id];

  return (
    <section
      style={{
        background: "#050505",
        color: "white",
        minHeight: "100vh",
        padding: "120px 8%",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* HERO IMAGE */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          marginBottom: "50px",
          border: "1px solid rgba(212,175,55,0.25)",
        }}
      >
        <img
          src={news.image}
          alt=""
          style={{
            width: "100%",
            height: "550px",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.2))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50px",
            maxWidth: "700px",
          }}
        >
          <p
            style={{
              color: "#d4af37",
              fontWeight: "700",
              marginBottom: "15px",
              fontSize: "15px",
            }}
          >
            ● {news.date}
          </p>
          <h1
            style={{
              fontSize: "58px",
              lineHeight: "1.1",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            {news.title}
          </h1>
          <p
            style={{
              color: "#d7d7d7",
              lineHeight: "1.8",
              fontSize: "18px",
            }}
          >
            {news.desc}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 0.7fr",
          gap: "40px",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            background: "#111",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <h2 style={{ fontSize: "32px", marginBottom: "25px" }}>
            {t.newsDetailHeading}
          </h2>
          <p style={{ color: "#cfcfcf", lineHeight: "2", marginBottom: "25px" }}>
            {t.newsDetailP1}
          </p>
          <p style={{ color: "#cfcfcf", lineHeight: "2" }}>
            {t.newsDetailP2}
          </p>
        </div>

        {/* RIGHT */}
        <div
          style={{
            background: "#111",
            padding: "35px",
            borderRadius: "24px",
            border: "1px solid rgba(212,175,55,0.12)",
            height: "fit-content",
          }}
        >
          <h3 style={{ fontSize: "26px", marginBottom: "25px" }}>
            {t.whyChooseUs}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>{t.feature1}</div>
            <div>{t.feature2}</div>
            <div>{t.feature3}</div>
            <div>{t.feature4}</div>
            <div>{t.feature5}</div>
          </div>
          <button
            onClick={() => navigate("/ticket")}
            style={{
              marginTop: "35px",
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(45deg, #d4af37, #ffd700)",
              color: "black",
              fontWeight: "800",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {t.bookYourTrip}
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewsDetail;