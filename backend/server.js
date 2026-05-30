require("dotenv").config();

const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

const app = express();

// =====================
// FRONTEND URL
// =====================

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5180";

// =====================
// MIDDLEWARE
// =====================

app.use(cors({
  origin: [
    "https://deluxetravelexpress.vercel.app",
    "http://localhost:5173",
    "http://localhost:5180"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// =====================
// TEST ROUTE
// =====================

app.get("/", (req, res) => {

  res.send(
    "Backend Running Successfully"
  );

});

// =====================
// STRIPE CHECKOUT
// =====================

app.post(
  "/create-checkout-session",

  async (req, res) => {

    try {

      const {
        passengers,
        isRoundTrip,
        email,
        totalPrice,
      } = req.body;

      const amount =
        totalPrice ||
        (isRoundTrip
          ? 90 * passengers * 2
          : 90 * passengers);

      console.log(
        "FRONTEND_URL:",
        FRONTEND_URL
      );

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: ["card"],

          mode: "payment",

          customer_email: email,

          line_items: [
            {
              price_data: {

                currency: "cad",

                product_data: {
                  name:
                    "Deluxe Travel Express Ticket",
                },

                unit_amount:
                  Number(amount) * 100,
              },

              quantity: 1,
            },
          ],

       
success_url: `${FRONTEND_URL}/payment-success`,
cancel_url: `${FRONTEND_URL}/payment-cancel`,
        });
        console.log("new file running")

      res.json({
        url: session.url,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

// =====================
// SERVER
// =====================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server Running On Port ${PORT}`
  );

});
