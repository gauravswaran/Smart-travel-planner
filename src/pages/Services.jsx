function Services() {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <p>Explore the services offered by Smart Travel Planner.</p>

      <div className="services-grid">
        <article className="service-card">
          <h3>Trip Planning</h3>
          <p>Plan your trip based on your preferences.</p>
        </article>

        <article className="service-card">
          <h3>Budget Planning</h3>
          <p>Organise your travel budget in one place.</p>
        </article>

        <article className="service-card">
          <h3>Daily Itinerary</h3>
          <p>Get a day-wise outline for your journey.</p>
        </article>
      </div>
    </section>
  );
}

export default Services;