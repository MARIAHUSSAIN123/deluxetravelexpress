import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NewsDetail() {
  const { id } = useParams();
const navigate = useNavigate();
  const newsData = {
    1: {
      title: "Premium Airport Pickup Service Expanded",
      date: "April 2026",
      desc:
        "Luxury airport pickup and drop-off services are now available for additional premium locations. Customers can now enjoy more comfort, reliability, and a first-class travel experience with Deluxe Travel Express.",
      image:
        "https://i.pinimg.com/736x/26/f0/ce/26f0ced629a60a17c08b7d55ce882be3.jpg",
    },

    2: {
      title: "New Luxury SUV Fleet Added",
      date: "March 2026",
      desc:
        "Our fleet now includes additional premium SUVs featuring spacious interiors, modern comfort, luxury seating, and enhanced passenger experience for long-distance travel.",
      image:
        "https://i.pinimg.com/1200x/69/9a/5f/699a5ff83b850b255e088f305fa91d30.jpg",
    },

    3: {
      title: "Deluxe Travel Expands Intercity Routes",
      date: "February 2026",
      desc:
        "New premium intercity routes are being introduced to improve luxury travel accessibility between major cities with more comfort and convenience.",
      image:
        "https://i.pinimg.com/1200x/91/c3/24/91c324456cf8698f53fbaba83e506471.jpg",
    },
    4: {
  title: "Deluxe Travel Launches New Calgary Luxury Route",
  date: "May 2026",
  desc:
    "Deluxe Travel Express proudly introduces a premium SUV route designed for travelers seeking comfort, reliability, and luxury between Calgary and Edmonton.",
  image:
    "https://i.pinimg.com/1200x/3f/b2/9f/3fb29f0f32da1bdecff7b6c881a79fc9.jpg",
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
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "25px",
            }}
          >
            Luxury Travel Experience
          </h2>

          <p
            style={{
              color: "#cfcfcf",
              lineHeight: "2",
              marginBottom: "25px",
            }}
          >
            Deluxe Travel Express continues to redefine premium transportation
            by delivering luxury, comfort, and reliability for passengers
            traveling between major cities.
          </p>

          <p
            style={{
              color: "#cfcfcf",
              lineHeight: "2",
            }}
          >
            Our mission is to provide a smooth and elegant travel experience
            with modern vehicles, professional drivers, and premium customer
            support.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div
          style={{
            background: "#111",
            padding: "35px",
            borderRadius: "24px",
            border: "1px solid rgba(212,175,55,0.12)",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              fontSize: "26px",
              marginBottom: "25px",
            }}
          >
            Why Choose Us?
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div>✔ Premium Luxury Vehicles</div>
            <div>✔ Comfortable Long Routes</div>
            <div>✔ Airport Pickup Services</div>
            <div>✔ Professional Drivers</div>
            <div>✔ Affordable Luxury Travel</div>
          </div>

         <button
  onClick={() => navigate("/ticket")}
  style={{
    marginTop: "35px",
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(45deg, #d4af37, #ffd700)",
    color: "black",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  Book Your Trip
</button>
        </div>
      </div>
    </section>
  );
}

export default NewsDetail;