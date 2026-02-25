const Events = () => {
  return (
    <div className="panel-container">
      <h2 className="panel-title">Food Events</h2>

      <p className="panel-subtitle">
        Discover exclusive food festivals, pop-ups, and special dining events near you.
      </p>

      <div className="empty-state">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          alt="Food Events"
          width="120"
        />

        <h3>No Events Available</h3>
        <p>
          Currently there are no food events in your area.
          Stay tuned for exciting culinary experiences!
        </p>
      </div>
    </div>
  );
};

export default Events;