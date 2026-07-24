const WhenWhere = ({ startsAt, endsAt, venue }) => {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const fmtDate = (d) => d.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const fmtTime = (d) => d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });

  return (
    <section className="event-detail-section">
      <h2 className="event-detail-heading">When & Where</h2>

      <div className="event-detail-when-content">
      <div className="event-detail-date-grid">
        {/* Starts */}
        <div className="p-5 rounded-2xl border border-line bg-paper space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-maroon/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink">Starts</span>
          </div>
          <div>
            <p className="text-ink font-medium">{fmtDate(start)}</p>
            <p className="text-ink-soft text-sm">{fmtTime(start)}</p>
          </div>
        </div>

        {/* Ends */}
        <div className="p-5 rounded-2xl border border-line bg-paper space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-maroon/10 flex items-center justify-center">
              <svg className="h-4 w-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink">Ends</span>
          </div>
          <div>
            <p className="text-ink font-medium">{fmtDate(end)}</p>
            <p className="text-ink-soft text-sm">{fmtTime(end)}</p>
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="event-detail-venue p-5 rounded-2xl border border-line bg-paper">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-maroon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="h-4 w-4 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Venue</p>
            <p className="text-ink-soft">{venue}</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default WhenWhere;
