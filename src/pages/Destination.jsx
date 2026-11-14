import { useNavigate } from "react-router-dom";

function Destinations() {
  const navigate = useNavigate();

  const destinations = [
    {
      name: "Manali",
      description: "Explore mountains, snow and beautiful valleys.",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    },
    {
      name: "Goa",
      description: "Enjoy beaches, sunsets and coastal adventures.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    },
    {
      name: "Jaipur",
      description: "Discover royal palaces, forts and culture.",
      image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800",
    },
  ];

  const planTrip = (place) => {
    window.dispatchEvent(
      new CustomEvent("selectDestination", {
        detail: place,
      })
    );

    navigate("/planner");
  };

  return (
    <section className="destinations">
      <h2>Popular Destinations</h2>
      <p>Find your next favourite place to explore.</p>

      <div className="destination-grid">
        {destinations.map((destination) => (
          <article className="destination-card" key={destination.name}>
            <img
              className="destination-photo"
              src={destination.image}
              alt={destination.name}
            />

            <div className="destination-info">
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>

              <button onClick={() => planTrip(destination.name)}>
                Plan This Trip
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Destinations;