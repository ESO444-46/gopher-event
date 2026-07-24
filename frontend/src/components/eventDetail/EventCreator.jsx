const EventCreator = ({firstName,lastName}) => {
  return (
    <section className="event-detail-section">
      <h2 className="event-detail-heading">Organized by</h2>

      <div className="event-detail-organizer flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">{`${firstName[0]}${lastName[0]}`}</span>
        </div>
        <div>
          <p className="font-semibold text-ink">{`${firstName} ${lastName}`}</p>
          <p className="text-ink-soft text-sm">Event Organizer</p>
        </div>
      </div>
    </section>
  );
};

export default EventCreator;
