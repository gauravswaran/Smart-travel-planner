import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p>YOUR NEXT ADVENTURE STARTS HERE</p>

        <h1>Explore the World, Your Way.</h1>

        <p>
          Plan your dream trip, explore amazing destinations,
          and create unforgettable travel experiences.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/planner")}
        >
          Plan Your Trip →
        </button>
      </div>
    </section>
  );
}

export default Home;