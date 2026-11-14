import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Destinations from "./pages/Destination";
import MyTripsPage from "./pages/MyTripPage";
import Services from "./pages/Services";
import AboutPage from "./pages/AboutPage";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/my-trips" element={<MyTripsPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <footer className="footer">
        <p>© 2026 Smart Travel Planner. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;