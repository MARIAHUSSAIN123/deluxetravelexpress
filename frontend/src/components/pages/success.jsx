import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
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
            "0 0 40px rgba(255,215,0,0.2)",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#1fdf64",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 30px",
            fontSize: "60px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            color: "white",
            fontSize: "42px",
            marginBottom: "15px",
          }}
        >
          Payment Successful
        </h1>

        <p
          style={{
            color: "#ccc",
            fontSize: "18px",
            lineHeight: "30px",
            marginBottom: "35px",
          }}
        >
          Your luxury ticket booking has been
          confirmed successfully.
          <br />
          Thank you for choosing us ✨
        </p>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/">
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
              Back To Home
            </button>
          </Link>

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
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;