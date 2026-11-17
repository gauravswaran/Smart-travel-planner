import { useEffect, useState } from "react";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Destination images
  const getDestinationImage = (destination) => {
    const place = destination.toLowerCase().trim();

    const images = {
      manali:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      shimla:
        "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800",
      simla:
        "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800",
      goa:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      jaipur:
        "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
      chandigarh:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZfxyFTuAZpF4IeofJLwqZ5fKycUBDGy6ut8aj36fwaoTfllX2W5063GxJ&s=10",
      mohali:
        "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800",
      amritsar:
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800",
      delhi:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      mumbai:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
      kashmir:
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800",
      rishikesh:
        "https://images.unsplash.com/photo-1609948543911-7f01ff385be7?w=800",
      dharamshala:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    };

    return (
      images[place] ||
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // GET API - Fetch All Trips
  const fetchTrips = () => {
    fetch("/api/trips")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load trips");
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // DELETE API
  const deleteTrip = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/trips/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Unable to delete trip");
      }

      setTrips((previousTrips) =>
        previousTrips.filter((trip) => trip._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // PUT API - Edit Trip
  const editTrip = async (trip) => {
    const destination = prompt(
      "Enter new destination:",
      trip.destination
    );

    if (destination === null) return;

    if (!destination.trim()) {
      alert("Destination cannot be empty!");
      return;
    }

    const travelDate = prompt(
      "Enter new travel date (YYYY-MM-DD):",
      trip.travelDate.split("T")[0]
    );

    if (travelDate === null) return;

    const travelers = prompt(
      "Enter travelers:",
      trip.travelers
    );

    if (travelers === null) return;

    const budget = prompt(
      "Enter budget:",
      trip.budget
    );

    if (budget === null) return;

    if (
      !travelDate.trim() ||
      !Number.isInteger(Number(travelers)) ||
      Number(travelers) < 1 ||
      !Number.isFinite(Number(budget)) ||
      Number(budget) <= 0
    ) {
      alert("Please enter valid trip details!");
      return;
    }

    try {
      const response = await fetch(
        `/api/trips/${trip._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: destination.trim(),
            travelDate,
            travelers: Number(travelers),
            budget: Number(budget),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update trip");
      }

      alert("Trip updated successfully!");
      fetchTrips();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <section className="planner-section" id="my-trips">
      <div className="my-trips-heading">
        <span className="my-trips-tag">YOUR JOURNEY</span>
        <h2>My Trips</h2>
        <p>All your saved travel plans in one place.</p>
      </div>

      {loading && <p className="trips-message">Loading your trips...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && trips.length === 0 && (
        <div className="empty-trips">
          <span>✈️</span>
          <h3>No Trips Saved Yet</h3>
          <p>Your saved travel plans will appear here.</p>
        </div>
      )}

      {!loading && trips.length > 0 && (
        <div className="my-trips-grid">
          {trips.map((trip) => (
            <article className="my-trip-card" key={trip._id}>
              <div className="my-trip-image-wrapper">
                <img
                  className="my-trip-image"
                  src={getDestinationImage(trip.destination)}
                  alt={trip.destination}
                  loading="lazy"
                />
                <span className="image-trip-label">SAVED TRIP</span>
              </div>

              <div className="my-trip-content">
                <h3>{trip.destination}</h3>

                <div className="trip-details">
                  <div className="trip-detail-item">
                    <span>📅 Travel Date</span>
                    <strong>{formatDate(trip.travelDate)}</strong>
                  </div>

                  <div className="trip-detail-item">
                    <span>👥 Travellers</span>
                    <strong>
                      {trip.travelers}{" "}
                      {Number(trip.travelers) === 1 ? "person" : "people"}
                    </strong>
                  </div>

                  <div className="trip-detail-item trip-budget">
                    <span>💰 Total Budget</span>
                    <strong>
                      ₹{Number(trip.budget || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="trip-actions">
                  <button
                    className="edit-trip-btn"
                    onClick={() => editTrip(trip)}
                  >
                    Edit Trip
                  </button>

                  <button
                    className="delete-trip-btn"
                    onClick={() => deleteTrip(trip._id)}
                  >
                    Delete Trip
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyTrips;