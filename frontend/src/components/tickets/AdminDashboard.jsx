import React, {
  useEffect,
  useState,
} from "react";

import "./AdminDashboard.css";

import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase";

import Swal from "sweetalert2";

import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_w54sho2";
const EMAILJS_USER_TEMPLATE = "template_w8jlcvg";
const EMAILJS_DRIVER_TEMPLATE = "template_w8jlcvg";
const EMAILJS_PUBLIC_KEY = "Q2aYrQi8_-EbYY6kQ";
const DRIVER_EMAIL = "deluxedrive05@gmail.com";

const AdminDashboard = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [tripsCount, setTripsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          orderBy("createdAt", "desc")
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        setBookings(bookingsData);

        const usersSnapshot = await getDocs(collection(db, "users"));
        setUsersCount(usersSnapshot.size);

        const tripsSnapshot = await getDocs(collection(db, "trips"));
        setTripsCount(tripsSnapshot.size);

        const revenue = bookingsData.reduce(
          (total, booking) => total + Number(booking.totalPrice || 0), 0
        );
        setTotalRevenue(revenue);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const resetAllSeats = async () => {
    try {
      const tripsSnapshot = await getDocs(collection(db, "trips"));
      const promises = tripsSnapshot.docs.map((tripDoc) =>
        updateDoc(doc(db, "trips", tripDoc.id), { availableSeats: 5 })
      );
      await Promise.all(promises);
      Swal.fire({ icon: "success", title: "Seats Reset", text: "All seats reset to 5" });
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Reset Failed", text: "Something went wrong" });
    }
  };

  const updateBookingStatus = async (booking, status) => {
    try {
      await updateDoc(doc(db, "bookings", booking.id), { status });

      if (status === "approved") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_USER_TEMPLATE,
          {
            to_email: booking["e-mail"] || booking.email,
            passenger_name: booking.passengerName,
            email: booking["e-mail"] || booking.email,
            from: booking.from,
            to: booking.to,
            departure: booking.departureDate,
            arrival: booking.arrival || booking.arrivalDate || "",
            passengers: booking.passengers,
            total_price: booking.totalPrice,
            status: "Approved ✔️",
          },
          EMAILJS_PUBLIC_KEY
        );

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_DRIVER_TEMPLATE,
          {
            to_email: DRIVER_EMAIL,
            passenger_name: booking.passengerName,
            email: booking["e-mail"] || booking.email,
            phone: booking.phone || "",
            from: booking.from,
            to: booking.to,
            departure: booking.departureDate,
            arrival: booking.arrival || "",
            passengers: booking.passengers,
            total_price: booking.totalPrice,
            status: "New Approved Booking",
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      setBookings(bookings.map((item) =>
        item.id === booking.id ? { ...item, status } : item
      ));

      Swal.fire({ icon: "success", title: "Booking Updated", text: `Booking ${status}` });

    } catch (error) {
      console.log("Full error", error);
      Swal.fire({ icon: "error", title: "Error", text: error.message || JSON.stringify(error) });
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.passengerName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-text">Loading Dashboard...</div>;
  }

  const tdStyle = {
    verticalAlign: "middle",
    padding: "14px 22px",
  };

  return (
    <div className="admin-bookings-page">

      <h1 className="admin-bookings-title">Admin Dashboard</h1>

      <input
        type="text"
        placeholder="Search bookings..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="reset-btn" onClick={resetAllSeats}>
        Reset All Seats
      </button>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card"><h3>Total Bookings</h3><p>{bookings.length}</p></div>
        <div className="stat-card"><h3>Approved</h3><p>{bookings.filter((b) => b.status === "approved").length}</p></div>
        <div className="stat-card"><h3>Pending</h3><p>{bookings.filter((b) => !b.status || b.status === "pending").length}</p></div>
        <div className="stat-card"><h3>Users</h3><p>{usersCount}</p></div>
        <div className="stat-card"><h3>Trips</h3><p>{tripsCount}</p></div>
        <div className="stat-card"><h3>Revenue</h3><p>${totalRevenue.toLocaleString()}</p></div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Route</th>
              <th>Email</th>
              <th>Passengers</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} style={{ verticalAlign: "middle" }}>

                <td style={tdStyle}>{booking.passengerName}</td>
                <td style={tdStyle}>{booking.from} → {booking.to}</td>
                <td style={tdStyle}>{booking["e-mail"] || booking.email}</td>
                <td style={tdStyle}>{booking.passengers}</td>
                <td style={tdStyle}>${booking.totalPrice}</td>

                <td style={tdStyle}>
                  <span className={`status-badge ${
                    booking.status === "approved" ? "status-approved" :
                    booking.status === "rejected" ? "status-rejected" :
                    "status-pending"
                  }`}>
                    {booking.status || "pending"}
                  </span>
                </td>

                <td style={{ verticalAlign: "middle",padding: "14px 18px",minWidth: "180px" }} className="actions-cell">
                  <div className="booking-actions">
                    <button
                      className="approve-btn"
                      onClick={() => updateBookingStatus(booking, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => updateBookingStatus(booking, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-bookings">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="mobile-booking-card">

            <h3>{booking.passengerName}</h3>
            <p>🛣️ Route: <span>{booking.from} → {booking.to}</span></p>
            <p>📧 Email: <span>{booking["e-mail"] || booking.email}</span></p>
            <p>👥 Passengers: <span>{booking.passengers}</span></p>
            <p>💰 Total: <span>${booking.totalPrice}</span></p>
            <p>📅 Date: <span>{booking.departureDate}</span></p>

            <div className="mobile-card-footer">
              <span className={`status-badge ${
                booking.status === "approved" ? "status-approved" :
                booking.status === "rejected" ? "status-rejected" :
                "status-pending"
              }`}>
                {booking.status || "pending"}
              </span>

              <div className="booking-actions">
                <button
                  className="approve-btn"
                  onClick={() => updateBookingStatus(booking, "approved")}
                >
                  ✓ Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => updateBookingStatus(booking, "rejected")}
                >
                  ✕ Reject
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;