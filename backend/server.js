require("dotenv").config();

console.log("new server file running");

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const nodemailer = require("nodemailer");
const cron = require("node-cron");

const {
  initializeApp,
} = require("firebase/app");

const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} = require("firebase/firestore");

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// FIREBASE CONFIG
// ============================

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,

  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.FIREBASE_APP_ID,
};

const firebaseApp =
  initializeApp(firebaseConfig);

const db =
  getFirestore(firebaseApp);

// ============================
// EMAIL TRANSPORTER
// ============================

const transporter =
  nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

// ============================
// TEST ROUTE
// ============================

app.get("/", (req, res) => {

  res.send("Backend Working");
});

// ============================
// SEND TEST EMAIL
// ============================

app.get(
  "/send-test-email",

  async (req, res) => {

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          process.env.EMAIL_USER,

        subject:
          "Luxury Travel Reminder",

        html: `
<div style="font-family:Arial;padding:30px;background:#f5f5f5;">

  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;">

    <h1 style="color:#d4af37;text-align:center;">
      Deluxe Travel Express
    </h1>

    <h2 style="text-align:center;color:#222;">
      Booking Confirmed 🎉
    </h2>

    <p style="font-size:16px;color:#555;">
      Your booking has been confirmed successfully.
    </p>

    <p>
      Thank you for choosing Deluxe Travel Express.
    </p>

  </div>

</div>
        `,
      });

      res.send(
        "Email Sent Successfully"
      );

    } catch (error) {

      console.log(error);

      res
        .status(500)
        .send(error.message);
    }
  }
);

// ============================
// STRIPE PAYMENT
// ============================

app.post(
  "/create-checkout-session",

  async (req, res) => {

    try {

      const {
        passengers,
        isRoundTrip,
        email,
      } = req.body;

      const totalAmount =
        isRoundTrip
          ? 90 *
            passengers *
            2
          : 90 * passengers;

      // ======================
      // SEND BOOKING EMAIL
      // ======================

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "Luxury Travel Booking",

        html: `
<div style="font-family:sans-serif;padding:20px;">

  <h1 style="color:gold;">
    Luxury Travel Express
  </h1>

  <h2>
    Booking Confirmed 🎉
  </h2>

  <p>
    Your booking request has been received.
  </p>

  <hr />

  <p>
    Passengers:
    ${passengers}
  </p>

  <p>
    Trip Type:
    ${
      isRoundTrip
        ? "Round Trip"
        : "One Way"
    }
  </p>

  <p>
    Total:
    $${totalAmount} CAD
  </p>

</div>
        `,
      });

      // ======================
      // STRIPE SESSION
      // ======================

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: [
            "card",
          ],

          mode: "payment",

          line_items: [
            {
              price_data: {

                currency: "cad",

                product_data: {
                  name:
                    "Luxury Travel Ticket",
                },

                unit_amount:
                  totalAmount *
                  100,
              },

              quantity: 1,
            },
          ],

          success_url:
            "http://localhost:5173/success",

          cancel_url:
            "http://localhost:5173/cancel",
        });

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

// ============================
// AUTO REMINDER EMAIL
// ============================

cron.schedule(
  "* * * * *",

  async () => {

    console.log(
      "Checking bookings every minute..."
    );

    try {

      const snapshot =
        await getDocs(
          collection(
            db,
            "bookings"
          )
        );

      const now =
        new Date();

      snapshot.forEach(
        async (docItem) => {

          const booking =
            docItem.data();

          if (
            booking.reminderSent
          )
            return;

          if (
            !booking.departureDate
          )
            return;

          if (
            !booking.departure
          )
            return;

          const tripDateTime =
            new Date(
              `${booking.departureDate} ${booking.departure}`
            );

          const diff =
            (tripDateTime -
              now) /
            (1000 *
              60 *
              60);

          // SEND BEFORE 2 HOURS
          if (
            diff <= 2 &&
            diff > 1.8
          ) {

            await transporter.sendMail({

              from:
                process.env.EMAIL_USER,

              to:
                booking.email,

              subject:
                "Trip Reminder - Luxury Travel",

              html: `
<div style="font-family:sans-serif;padding:20px;">

  <h1 style="color:gold;">
    Luxury Travel Express
  </h1>

  <h2>
    Your trip starts in 2 hours
  </h2>

  <p>
    Route:
    ${booking.from}
    →
    ${booking.to}
  </p>

  <p>
    Departure Time:
    ${booking.departure}
  </p>

  <p>
    Passenger:
    ${booking.passengerName}
  </p>

</div>
              `,
            });

            await updateDoc(
              doc(
                db,
                "bookings",
                docItem.id
              ),

              {
                reminderSent: true,
              }
            );

            console.log(
              "Reminder email sent"
            );
          }
        }
      );

    } catch (error) {

      console.log(error);
    }
  }
);

// ============================
// SERVER
// ============================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});