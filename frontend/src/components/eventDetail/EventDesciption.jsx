const EventDescription = ({description}) => {
  return (
    <section className="event-detail-section">
      <h2 className="event-detail-heading">About this event</h2>
      <div className="event-detail-copy">
        {description}
      </div>
    </section>
  );
};

export default EventDescription;
