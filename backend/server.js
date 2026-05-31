require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

// =====================
// FIREBASE ADMIN
// =====================

let dbAdmin;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  dbAdmin = admin.firestore();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.log("Firebase init error:", error.message);
}

// =====================
// NODEMAILER
// =====================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
    "https://www.deluxetravelexpress.com",
    "https://deluxeexpresstravel.com",
    "http://localhost:5173",
    "http://localhost:5174",
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
  res.send("Backend Running Successfully");
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
                  name: "Deluxe Travel Express Ticket",
                },
                unit_amount: Number(amount) * 100,
              },
              quantity: 1,
            },
          ],
          success_url: `${FRONTEND_URL}/payment-success`,
          cancel_url: `${FRONTEND_URL}/payment-cancel`,
        });

      res.json({ url: session.url });

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// =====================
// PARSE DEPARTURE HOUR
// =====================

function parseDepHour(timeStr) {
  try {
    if (!timeStr) return -1;
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours;
  } catch {
    return -1;
  }
}

// =====================
// CRON ROUTE
// =====================

app.get("/send-reminders", async (req, res) => {
  try {
    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const targetDate = fourHoursLater.toISOString().split("T")[0];
    const targetHour = fourHoursLater.getHours();

    const snapshot = await dbAdmin
      .collection("bookings")
      .where("status", "==", "approved")
      .where("reminderSent", "==", false)
      .get();

    if (snapshot.empty) {
      return res.json({ message: "No bookings to remind." });
    }

    let sent = 0;

    for (const docItem of snapshot.docs) {
      const booking = docItem.data();
      if (booking.departureDate !== targetDate) continue;
      const depHour = parseDepHour(booking.departure || "");
      if (Math.abs(depHour - targetHour) > 1) continue;
      const userEmail = booking["e-mail"] || booking.email;
      if (!userEmail) continue;

      await transporter.sendMail({
        from: `"Deluxe Travel Express" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "⏰ Your Trip Departs in 4 Hours — Deluxe Travel Express",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #0ea5e9;">Deluxe Travel Express</h2>
            <p>Dear <strong>${booking.passengerName}</strong>,</p>
            <p>Your trip departs in approximately <strong>4 hours</strong>.</p>
            <table style="width:100%; border-collapse:collapse; margin:20px 0;">
              <tr><td style="padding:8px; color:#666;">Route:</td><td style="padding:8px;"><strong>${booking.from} → ${booking.to}</strong></td></tr>
              <tr><td style="padding:8px; color:#666;">Date:</td><td style="padding:8px;"><strong>${booking.departureDate}</strong></td></tr>
              <tr><td style="padding:8px; color:#666;">Departure:</td><td style="padding:8px;"><strong>${booking.departure}</strong></td></tr>
              <tr><td style="padding:8px; color:#666;">Passengers:</td><td style="padding:8px;"><strong>${booking.passengers}</strong></td></tr>
            </table>
            <p>Please be at the stop <strong>on time</strong>!</p>
            <p style="color:#0ea5e9; font-weight:bold;">— The Deluxe Travel Express Team</p>
          </div>
        `,
      });

      await dbAdmin.collection("bookings").doc(docItem.id).update({
        reminderSent: true,
      });

      sent++;
    }

    res.json({ message: `${sent} reminders sent.` });

  } catch (error) {
    console.log("Cron error:", error);
    res.status(500).json({ error: error.message });
  }
});

// =====================
// VERCEL KE LIYE
// =====================

module.exports = app;
