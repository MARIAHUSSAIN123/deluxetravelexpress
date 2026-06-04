import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_w54sho2";
const EMAILJS_USER_TEMPLATE = "template_w8jlcvg";
const EMAILJS_DRIVER_TEMPLATE = "template_w8jlcvg";
const EMAILJS_PUBLIC_KEY = "Q2aYrQi8_-EbYY6kQ";
const DRIVER_EMAIL = "deluxedrive05@gmail.com";

const TRIPS_CONFIG = {
  "cal-edm": {
    label: "Calgary → Edmonton",
    status: "active",
    trips: [
      { id: "cal-edm-1", label: "Trip 1", time: "07:00 AM" },
      { id: "cal-edm-2", label: "Trip 2", time: "09:00 AM" },
      { id: "cal-edm-3", label: "Trip 3", time: "03:00 PM" },
      { id: "cal-edm-4", label: "Trip 4", time: "05:00 PM" },
    ],
  },
  "edm-cal": {
    label: "Edmonton → Calgary",
    status: "active",
    trips: [
      { id: "edm-cal-1", label: "Trip 1", time: "07:00 PM" },
      { id: "edm-cal-2", label: "Trip 2", time: "11:00 AM" },
      { id: "edm-cal-3", label: "Trip 3", time: "01:00 PM" },
      { id: "edm-cal-4", label: "Trip 4", time: "09:00 PM" },
    ],
  },
  "ott-tor": {
    label: "Ottawa → Toronto",
    status: "coming_soon",
    trips: [
      { id: "ott-tor-1", label: "Trip 1", time: "09:00 AM" },
      { id: "ott-tor-2", label: "Trip 2", time: "05:00 PM" },
    ],
  },
  "tor-ott": {
    label: "Toronto → Ottawa",
    status: "coming_soon",
    trips: [
      { id: "tor-ott-1", label: "Trip 1", time: "08:00 AM" },
      { id: "tor-ott-2", label: "Trip 2", time: "04:00 PM" },
    ],
  },
  "cal-banff": {
    label: "Calgary → Banff",
    status: "disabled",
    trips: [
      { id: "z-disabled-cal-banff-1", label: "Trip 1", time: "08:00 AM" },
      { id: "z-disabled-cal-banff-2", label: "Trip 2", time: "10:00 AM" },
    ],
  },
  "banff-cal": {
    label: "Banff → Calgary",
    status: "disabled",
    trips: [
      { id: "zzz-banff-cal-1", label: "Trip 1", time: "10:00 AM" },
      { id: "zzz-banff-cal-2", label: "Trip 2", time: "02:00 PM" },
    ],
  },
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateBookingStatus = async (booking, status) => {
    try {
      await updateDoc(doc(db, "bookings", booking.id), { status });
      if (status === "approved") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_USER_TEMPLATE, {
          to_email: booking["e-mail"] || booking.email,
          passenger_name: booking.passengerName,
          email: booking["e-mail"] || booking.email,
          from: booking.from, to: booking.to,
          departure: booking.departureDate,
          arrival: booking.arrival || booking.arrivalDate || "",
          passengers: booking.passengers,
          total_price: booking.totalPrice,
          status: "Approved ✔️",
        }, EMAILJS_PUBLIC_KEY);
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_DRIVER_TEMPLATE, {
          to_email: DRIVER_EMAIL,
          passenger_name: booking.passengerName,
          email: booking["e-mail"] || booking.email,
          phone: booking.phone || "",
          from: booking.from, to: booking.to,
          departure: booking.departureDate,
          arrival: booking.arrival || "",
          passengers: booking.passengers,
          total_price: booking.totalPrice,
          status: "New Approved Booking",
        }, EMAILJS_PUBLIC_KEY);
      }
      setBookings((prev) => prev.map((item) => (item.id === booking.id ? { ...item, status } : item)));
      Swal.fire({ icon: "success", title: "Updated!", text: `Booking ${status}` });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
  };

  const getBookingsForTrip = (tripId) => {
    const routeKey = Object.keys(TRIPS_CONFIG).find((k) =>
      TRIPS_CONFIG[k].trips.some((t) => t.id === tripId)
    );
    const config = TRIPS_CONFIG[routeKey]?.trips.find((t) => t.id === tripId);
    if (!config || !routeKey) return [];
    const routeLabel = TRIPS_CONFIG[routeKey].label;
    const [fromCity, toCity] = routeLabel.split(" → ");
    return bookings.filter((b) => {
      const routeMatch = b.from === fromCity && b.to === toCity;
      const timeMatch = b.departure === config.time;
      return routeMatch && timeMatch;
    });
  };

  const getTripRevenue = (tripId) =>
    getBookingsForTrip(tripId).reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const getTotalRevenue = () =>
    bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const getRouteRevenue = (routeKey) =>
    TRIPS_CONFIG[routeKey].trips.reduce((sum, t) => sum + getTripRevenue(t.id), 0);

  if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;

  const currentTrips = selectedRoute ? TRIPS_CONFIG[selectedRoute].trips : [];
  const currentTripBookings = selectedTrip ? getBookingsForTrip(selectedTrip) : [];
  const filteredBookings = currentTripBookings.filter((b) =>
    b.passengerName?.toLowerCase().includes(search.toLowerCase())
  );
  const currentTripConfig = selectedTrip
    ? Object.values(TRIPS_CONFIG).flatMap((r) => r.trips).find((t) => t.id === selectedTrip)
    : null;

  const getRouteBtnStyle = (key) => {
    const status = TRIPS_CONFIG[key].status;
    const isSelected = selectedRoute === key;
    if (status === "disabled") return { ...styles.routeBtn, ...styles.routeBtnDisabled, ...(isSelected ? styles.routeBtnDisabledActive : {}) };
    if (status === "coming_soon") return { ...styles.routeBtn, ...styles.routeBtnSoon, ...(isSelected ? styles.routeBtnSoonActive : {}) };
    return { ...styles.routeBtn, ...(isSelected ? styles.routeBtnActive : {}) };
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* STATS */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}><div style={styles.statLabel}>Total Bookings</div><div style={styles.statVal}>{bookings.length}</div></div>
        <div style={styles.statCard}><div style={styles.statLabel}>Approved</div><div style={styles.statVal}>{bookings.filter((b) => b.status === "approved").length}</div></div>
        <div style={styles.statCard}><div style={styles.statLabel}>Pending</div><div style={styles.statVal}>{bookings.filter((b) => !b.status || b.status === "pending").length}</div></div>
        <div style={styles.statCard}><div style={styles.statLabel}>Total Revenue</div><div style={styles.statVal}>${getTotalRevenue().toLocaleString()}</div></div>
      </div>

      {/* ROUTE BUTTONS */}
      <div style={styles.routeRow}>
        {Object.entries(TRIPS_CONFIG).map(([key, val]) => (
          <button key={key} style={getRouteBtnStyle(key)}
            onClick={() => { setSelectedRoute(key); setSelectedTrip(null); setShowSummary(false); setSearch(""); }}>
            {val.label}
            {val.status === "coming_soon" && <span style={styles.soonTag}> 🔜</span>}
            {val.status === "disabled" && <span style={styles.soonTag}> 🔒</span>}
          </button>
        ))}
        <button style={{ ...styles.routeBtn, ...styles.summaryBtn, ...(showSummary ? styles.summaryBtnActive : {}) }}
          onClick={() => { setShowSummary(true); setSelectedRoute(null); setSelectedTrip(null); }}>
          💰 Total Payment Summary
        </button>
      </div>

      {/* TRIP BUTTONS */}
      {selectedRoute && !showSummary && (
        <>
          {TRIPS_CONFIG[selectedRoute].status !== "active" && (
            <div style={styles.comingSoonBanner}>
              {TRIPS_CONFIG[selectedRoute].status === "coming_soon" ? "🔜 Coming Soon — This route is not yet active" : "🔒 This route is currently disabled"}
            </div>
          )}
          <div style={styles.tripRow}>
            {currentTrips.map((trip) => (
              <button key={trip.id}
                style={{ ...styles.tripBtn, ...(selectedTrip === trip.id ? styles.tripBtnActive : {}) }}
                onClick={() => { setSelectedTrip(trip.id); setSearch(""); }}>
                <div style={styles.tripBtnLabel}>{trip.label}</div>
                <div style={styles.tripBtnTime}>{trip.time}</div>
                <div style={styles.tripBtnRev}>${getTripRevenue(trip.id).toLocaleString()}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* TRIP DETAIL */}
      {selectedTrip && !showSummary && (
        <div style={styles.tripDetail}>
          <div style={styles.tripDetailHeader}>
            <div>
              <span style={styles.tripDetailTitle}>{TRIPS_CONFIG[selectedRoute].label} — {currentTripConfig?.label}</span>
              <span style={styles.tripDetailTime}> ⏰ {currentTripConfig?.time}</span>
            </div>
            <div style={styles.tripDetailRevenue}>Trip Total: ${getTripRevenue(selectedTrip).toLocaleString()}</div>
          </div>
          <input type="text" placeholder="Search passenger..." style={styles.searchInput}
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {filteredBookings.length === 0 ? (
            <div style={styles.noBookings}>No bookings for this trip yet.</div>
          ) : (
            <>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Passenger</th>
                      <th style={styles.th}>Route</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Passengers</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} style={styles.tableRow}>
                        <td style={styles.td}>{booking.passengerName}</td>
                        <td style={styles.td}>{booking.from} → {booking.to}</td>
                        <td style={styles.td}>{booking["e-mail"] || booking.email}</td>
                        <td style={styles.td}>{booking.departureDate}</td>
                        <td style={styles.td}>{booking.passengers}</td>
                        <td style={styles.td}>${booking.totalPrice}</td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: booking.status === "approved" ? "#16a34a" : booking.status === "rejected" ? "#dc2626" : "#d97706" }}>
                            {booking.status || "pending"}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns}>
                            <button style={styles.approveBtn} onClick={() => updateBookingStatus(booking, "approved")}>✓ Approve</button>
                            <button style={styles.rejectBtn} onClick={() => updateBookingStatus(booking, "rejected")}>✕ Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.mobileCards}>
                {filteredBookings.map((booking) => (
                  <div key={booking.id} style={styles.mobileCard}>
                    <div style={styles.mobileCardName}>{booking.passengerName}</div>
                    <div style={styles.mobileCardRow}>🛣️ {booking.from} → {booking.to}</div>
                    <div style={styles.mobileCardRow}>📧 {booking["e-mail"] || booking.email}</div>
                    <div style={styles.mobileCardRow}>📅 {booking.departureDate}</div>
                    <div style={styles.mobileCardRow}>👥 {booking.passengers} passenger(s)</div>
                    <div style={styles.mobileCardRow}>💰 ${booking.totalPrice}</div>
                    <div style={styles.mobileCardFooter}>
                      <span style={{ ...styles.badge, background: booking.status === "approved" ? "#16a34a" : booking.status === "rejected" ? "#dc2626" : "#d97706" }}>
                        {booking.status || "pending"}
                      </span>
                      <div style={styles.actionBtns}>
                        <button style={styles.approveBtn} onClick={() => updateBookingStatus(booking, "approved")}>✓</button>
                        <button style={styles.rejectBtn} onClick={() => updateBookingStatus(booking, "rejected")}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* SUMMARY */}
      {showSummary && (
        <div style={styles.summaryBox}>
          <h2 style={styles.summaryTitle}>💰 Total Payment Summary</h2>
          {Object.entries(TRIPS_CONFIG).map(([routeKey, routeVal]) => (
            <div key={routeKey} style={styles.summaryRoute}>
              <h3 style={styles.summaryRouteTitle}>
                {routeVal.label}
                {routeVal.status === "coming_soon" && <span style={styles.soonTagSummary}> 🔜 Coming Soon</span>}
                {routeVal.status === "disabled" && <span style={styles.soonTagSummary}> 🔒 Disabled</span>}
              </h3>
              <div style={styles.summaryTrips}>
                {routeVal.trips.map((trip) => {
                  const tripBookings = getBookingsForTrip(trip.id);
                  const tripRev = getTripRevenue(trip.id);
                  return (
                    <div key={trip.id} style={styles.summaryTripCard}>
                      <div style={styles.summaryTripHeader}>
                        <span>{trip.label} — {trip.time}</span>
                        <span style={styles.summaryTripRev}>${tripRev.toLocaleString()}</span>
                      </div>
                      <div style={styles.summaryTripCount}>{tripBookings.length} booking(s)</div>
                    </div>
                  );
                })}
              </div>
              <div style={styles.summaryRouteTotal}>
                {routeVal.label} Total: <strong>${getRouteRevenue(routeKey).toLocaleString()}</strong>
              </div>
            </div>
          ))}
          <div style={styles.grandTotal}>🏆 Grand Total: ${getTotalRevenue().toLocaleString()}</div>
        </div>
      )}

      {!selectedRoute && !showSummary && (
        <div style={styles.defaultMsg}>👆 Select a route above to view trip details</div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#0f172a", padding: "24px 16px", paddingTop: "100px", fontFamily: "sans-serif", color: "#fff" },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff", fontSize: 20 },
  title: { fontSize: 28, fontWeight: 700, color: "#f59e0b", textAlign: "center", marginBottom: 24 },
  statsRow: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 28 },
  statCard: { background: "#1e293b", borderRadius: 12, padding: "16px 24px", textAlign: "center", minWidth: 120 },
  statLabel: { fontSize: 12, color: "#94a3b8", marginBottom: 6 },
  statVal: { fontSize: 24, fontWeight: 700, color: "#f59e0b" },
  routeRow: { display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 20 },
  routeBtn: { padding: "10px 20px", borderRadius: 30, border: "2px solid #f59e0b", background: "transparent", color: "#f59e0b", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  routeBtnActive: { background: "#f59e0b", color: "#0f172a" },
  routeBtnSoon: { border: "2px solid #3b82f6", color: "#3b82f6" },
  routeBtnSoonActive: { background: "#3b82f6", color: "#fff" },
  routeBtnDisabled: { border: "2px solid #475569", color: "#475569" },
  routeBtnDisabledActive: { background: "#475569", color: "#fff" },
  summaryBtn: { borderColor: "#22c55e", color: "#22c55e" },
  summaryBtnActive: { background: "#22c55e", color: "#0f172a" },
  soonTag: { fontSize: 12 },
  comingSoonBanner: { textAlign: "center", background: "#1e3a5f", color: "#93c5fd", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14 },
  tripRow: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 },
  tripBtn: { padding: "14px 20px", borderRadius: 14, border: "2px solid #334155", background: "#1e293b", color: "#fff", cursor: "pointer", textAlign: "center", minWidth: 120 },
  tripBtnActive: { border: "2px solid #f59e0b", background: "#292524" },
  tripBtnLabel: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  tripBtnTime: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  tripBtnRev: { fontSize: 14, color: "#f59e0b", fontWeight: 600 },
  tripDetail: { background: "#1e293b", borderRadius: 16, padding: 20, marginTop: 8 },
  tripDetailHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  tripDetailTitle: { fontSize: 18, fontWeight: 700, color: "#f59e0b" },
  tripDetailTime: { fontSize: 14, color: "#94a3b8" },
  tripDetailRevenue: { fontSize: 16, fontWeight: 700, color: "#22c55e", background: "#0f2818", padding: "8px 16px", borderRadius: 8 },
  searchInput: { width: "100%", padding: "10px 16px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", fontSize: 14, marginBottom: 16, boxSizing: "border-box" },
  noBookings: { textAlign: "center", color: "#64748b", padding: 32, fontSize: 16 },
  tableWrapper: { overflowX: "auto", display: "block" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  tableHead: { background: "#0f172a" },
  th: { padding: "12px 16px", textAlign: "left", color: "#f59e0b", fontWeight: 600, borderBottom: "1px solid #334155" },
  tableRow: { borderBottom: "1px solid #1e293b" },
  td: { padding: "12px 16px", color: "#e2e8f0", verticalAlign: "middle" },
  badge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#fff" },
  actionBtns: { display: "flex", gap: 8 },
  approveBtn: { padding: "6px 12px", borderRadius: 6, border: "none", background: "#16a34a", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  rejectBtn: { padding: "6px 12px", borderRadius: 6, border: "none", background: "#dc2626", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  mobileCards: { display: "none" },
  mobileCard: { background: "#0f172a", borderRadius: 12, padding: 16, marginBottom: 12 },
  mobileCardName: { fontSize: 18, fontWeight: 700, color: "#f59e0b", marginBottom: 8 },
  mobileCardRow: { fontSize: 14, color: "#cbd5e1", marginBottom: 4 },
  mobileCardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  summaryBox: { background: "#1e293b", borderRadius: 16, padding: 24 },
  summaryTitle: { fontSize: 22, fontWeight: 700, color: "#f59e0b", marginBottom: 20, textAlign: "center" },
  summaryRoute: { marginBottom: 24 },
  summaryRouteTitle: { fontSize: 18, color: "#f59e0b", marginBottom: 12, borderBottom: "1px solid #334155", paddingBottom: 8 },
  soonTagSummary: { fontSize: 13, color: "#94a3b8", fontWeight: 400 },
  summaryTrips: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  summaryTripCard: { background: "#0f172a", borderRadius: 10, padding: "12px 16px", minWidth: 160, flex: 1 },
  summaryTripHeader: { display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, marginBottom: 4 },
  summaryTripRev: { color: "#22c55e" },
  summaryTripCount: { fontSize: 12, color: "#64748b" },
  summaryRouteTotal: { textAlign: "right", color: "#94a3b8", fontSize: 15 },
  grandTotal: { textAlign: "center", fontSize: 22, fontWeight: 700, color: "#22c55e", marginTop: 20, padding: "16px", background: "#0f2818", borderRadius: 12 },
  defaultMsg: { textAlign: "center", color: "#64748b", fontSize: 16, marginTop: 40 },
};

export default AdminDashboard;
