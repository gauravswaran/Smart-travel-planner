import { useEffect, useState } from "react";

function TripForm() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("3");
  const [travelers, setTravelers] = useState("1");
  const [budget, setBudget] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const handleDestination = (event) => {
      setDestination(event.detail || "");
      setItinerary([]);
      setError("");
      setSuccess("");
    };

    window.addEventListener("selectDestination", handleDestination);

    return () => {
      window.removeEventListener("selectDestination", handleDestination);
    };
  }, []);

  const destinationPlans = {
    manali: [
      ["Arrival and Mall Road", "Check in and explore Mall Road."],
      ["Mountain Adventure", "Explore Solang Valley."],
      ["Local Sightseeing", "Visit Hadimba Temple and Old Manali."],
      ["Departure", "Enjoy breakfast before departure."],
    ],
    goa: [
      ["Arrival and Beach", "Check in and enjoy a nearby beach."],
      ["North Goa", "Explore beaches and local markets."],
      ["South Goa", "Discover peaceful beaches and heritage spots."],
      ["Departure", "Enjoy breakfast before departure."],
    ],
    jaipur: [
      ["Arrival and City Tour", "Explore the old city."],
      ["Forts and Palaces", "Visit Amber Fort and City Palace."],
      ["Culture and Food", "Explore Hawa Mahal surroundings."],
      ["Departure", "Enjoy breakfast before departure."],
    ],
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setItinerary([]);

    const cleanDestination = destination.trim();
    const days = Number(duration);
    const totalBudget = Number(budget);
    const totalTravelers = Number(travelers);

    if (!cleanDestination || !startDate || !budget) {
      setError("Please fill in all required details.");
      return;
    }

    if (startDate < getToday()) {
      setError("Please select today or a future travel date.");
      return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 30) {
      setError("Please enter a valid trip duration.");
      return;
    }

    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      setError("Please enter a valid budget greater than zero.");
      return;
    }

    if (
      !Number.isInteger(totalTravelers) ||
      totalTravelers < 1 ||
      totalTravelers > 6
    ) {
      setError("Please select valid number of travellers.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: cleanDestination,
          travelDate: startDate,
          travelers: totalTravelers,
          budget: totalBudget,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save trip.");
      }

      const plans =
        destinationPlans[cleanDestination.toLowerCase()] || [
          ["Explore the Destination", "Discover local attractions."],
          ["Local Experiences", "Explore nearby places and local food."],
          ["Relax and Sightsee", "Enjoy the area and local activities."],
          ["Departure", "Prepare for your return journey."],
        ];

      const dailyBudget = Math.floor(totalBudget / days);

      const generatedPlan = Array.from({ length: days }, (_, index) => {
        const plan = plans[index % plans.length];

        return {
          day: index + 1,
          title: plan[0],
          activity: plan[1],
          budget:
            index === days - 1
              ? totalBudget - dailyBudget * (days - 1)
              : dailyBudget,
        };
      });

      setItinerary(generatedPlan);
      setSuccess("Trip saved successfully in MongoDB!");
    } catch (error) {
      setError(error.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="planner-section" id="planner">
      <h2>Plan Your Trip</h2>
      <p>Create a suggested itinerary for your next adventure.</p>

      <form className="trip-form" onSubmit={handleSubmit}>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="e.g. Manali, Goa, Jaipur"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          required
        />

        <label htmlFor="startDate">Travel Start Date</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          min={getToday()}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />

        <label htmlFor="duration">Trip Duration</label>
        <select
          id="duration"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        >
          {[1, 2, 3, 4, 5, 7, 10].map((day) => (
            <option key={day} value={day}>
              {day} {day === 1 ? "day" : "days"}
            </option>
          ))}
        </select>

        <label htmlFor="travelers">Number of Travellers</label>
        <select
          id="travelers"
          value={travelers}
          onChange={(event) => setTravelers(event.target.value)}
        >
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "traveller" : "travellers"}
            </option>
          ))}
        </select>

        <label htmlFor="budget">Total Budget (₹)</label>
        <input
          id="budget"
          type="number"
          min="1"
          step="1"
          placeholder="Enter your total budget"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving Trip..." : "Generate My Itinerary"}
        </button>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="success-message" role="status">
            {success}
          </p>
        )}
      </form>

      {itinerary.length > 0 && (
        <div className="itinerary">
          <div className="itinerary-header">
            <div>
              <span className="itinerary-tag">YOUR TRAVEL PLAN</span>
              <h2>Your Suggested Itinerary</h2>
              <p>Your trip overview and day-wise travel schedule.</p>
            </div>
            <div className="itinerary-destination-icon">✈️</div>
          </div>

          <div className="itinerary-summary">
            <div className="summary-card">
              <span>📍 Destination</span>
              <strong>{destination}</strong>
            </div>

            <div className="summary-card">
              <span>📅 Start Date</span>
              <strong>{formatDate(startDate)}</strong>
            </div>

            <div className="summary-card">
              <span>🗓️ Duration</span>
              <strong>{duration} Days</strong>
            </div>

            <div className="summary-card">
              <span>👥 Travellers</span>
              <strong>{travelers}</strong>
            </div>

            <div className="summary-card budget-summary">
              <span>💰 Total Budget</span>
              <strong>₹{totalBudgetFormat(budget)}</strong>
            </div>
          </div>

          <div className="day-plan-heading">
            <h3>Day-wise Travel Plan</h3>
            <span>{itinerary.length} Days</span>
          </div>

          <div className="day-plan-list">
            {itinerary.map((day) => (
              <article className="day-card" key={day.day}>
                <div className="day-number">
                  <span>DAY</span>
                  <strong>{day.day}</strong>
                </div>

                <div className="day-details">
                  <h3>{day.title}</h3>
                  <p>{day.activity}</p>
                  <span className="daily-budget">
                    Suggested Budget: ₹{day.budget.toLocaleString("en-IN")}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="itinerary-note">
            Note: This is a sample itinerary. Actual travel costs and
            availability may vary.
          </p>
        </div>
      )}
    </section>
  );
}

function totalBudgetFormat(amount) {
  return Number(amount).toLocaleString("en-IN");
}

export default TripForm;