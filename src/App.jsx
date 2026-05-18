import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Schedule from "./components/SchedulePage";
import Services from "./components/Services";
import About from "./components/About";
import Signup from "./components/pages/Signup";
import AboutUs from "./components/pages/AboutUs";
import RoutesPage from "./components/pages/RoutesPage";
import Location from "./components/pages/Location";
import News from "./components/pages/News";
import Faq from "./components/pages/Faq";
import Contact from "./components/pages/Contact";
import Footer from "./components/pages/Footer";
import Ticket from "./components/pages/Ticket";
import AdminDashboard from "./components/tickets/AdminDashboard";
import AdminRoute from "./components/tickets/AdminRoute";


import "./App.css";

function Home() {
  return (
    <>
      <Hero />
      <Schedule />
      <About />
      <Services />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* PAGES */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/location" element={<Location />} />
        <Route path="/news" element={<News />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ticket" element={<Ticket />} />
 <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

      </Routes>
    </Router>
  );
}

export default App;