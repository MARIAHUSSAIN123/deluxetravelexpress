import React from "react";

import {
  useNavigate,
} from "react-router-dom";

const PaymentCancel = () => {

  const navigate =
    useNavigate();

  return (
    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#f5f5f5"
      }}
    >

      <div
        style={{
          background:"white",
          padding:"50px",
          borderRadius:"20px",
          textAlign:"center"
        }}
      >

        <h1>
          Payment Cancelled
        </h1>

        <p>
          Your payment was cancelled.
        </p>

        <button
          onClick={() =>
            navigate("/")
          }
        >
          Back Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;