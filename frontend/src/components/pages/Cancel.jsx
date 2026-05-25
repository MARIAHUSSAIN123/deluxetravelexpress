import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to right, #000000, #1a1a1a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid #333",
          borderRadius: "20px",
          padding: "50px",
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow:
            "0 0 40px rgba(255,0,0,0.15)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#ff3b30",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 30px",
            fontSize: "60px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ✕
        </div>

        <h1
          style={{
            color: "white",
            fontSize: "42px",
            marginBottom: "15px",
          }}
        >
          Payment Cancelled
        </h1>

        <p
          style={{
            color: "#ccc",
            fontSize: "18px",
            lineHeight: "30px",
            marginBottom: "35px",
          }}
        >
          Your booking payment was cancelled.
          <br />
          Don’t worry, no charges were made.
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/ticket">
            <button
              style={{
                padding:
                  "14px 30px",
                border: "none",
                borderRadius: "10px",
                background:
                  "#f4b400",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </Link>

          <Link to="/">
            <button
              style={{
                padding:
                  "14px 30px",
                border:
                  "1px solid #555",
                borderRadius: "10px",
                background:
                  "transparent",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Back To Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cancel;