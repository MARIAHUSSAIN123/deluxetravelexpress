import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import LanguageProvider from "./context/LanguageContext";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
} from "@stripe/stripe-js";

// STRIPE
const stripePromise =
  loadStripe(
    import.meta.env
      .VITE_STRIPE_PUBLIC_KEY
  );

createRoot(
  document.getElementById(
    "root"
  )
).render(

  <StrictMode>

    <Elements
      stripe={stripePromise}
    >

      <LanguageProvider>

        <App />

      </LanguageProvider>

    </Elements>

  </StrictMode>
);