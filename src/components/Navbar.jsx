import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        SmartTravel
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/destinations" onClick={closeMenu}>Destinations</Link>
        <Link to="/planner" onClick={closeMenu}>Plan Trip</Link>
        <Link to="/my-trips" onClick={closeMenu}>My Trips</Link>
        <Link to="/services" onClick={closeMenu}>Services</Link>
        <Link to="/about" onClick={closeMenu}>About Us</Link>

        {isLoggedIn ? (
          <>
            <span>Welcome, {user?.name || "User"}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;