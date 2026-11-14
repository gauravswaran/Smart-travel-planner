function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <p className="about-tag">ABOUT OUR PROJECT</p>

        <h2>Making Travel Planning Easier</h2>

        <p>
          Smart Travel Planner is a travel planning platform
          designed to help travellers explore destinations,
          organise their budgets and create personalised
          travel itineraries.
        </p>

        <p>
          Our goal is to make trip planning simple,
          convenient and enjoyable for everyone.
        </p>

        <div className="about-features">
          <div className="about-card">
            <h3>Easy Planning</h3>
            <p>Plan your journey with simple travel details.</p>
          </div>

          <div className="about-card">
            <h3>Budget Management</h3>
            <p>Organise your estimated travel expenses.</p>
          </div>

          <div className="about-card">
            <h3>Daily Itinerary</h3>
            <p>Generate a suggested day-wise travel plan.</p>
          </div>
        </div>

        <div className="about-tech">
          <h3>Technologies Used</h3>
          <p>React | JavaScript | HTML | CSS</p>
        </div>
      </div>
    </section>
  );
}

export default About;