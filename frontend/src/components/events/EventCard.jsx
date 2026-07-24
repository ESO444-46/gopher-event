import { useState } from "react";

const EventCard = ({ title, venue, startsAt, endsAt, imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const fmtDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const isSameDay = start.toDateString() === end.toDateString();

  const timeDisplay = isSameDay
    ? `${fmtDate(start)} • ${fmtTime(start)}`
    : `${fmtDate(start)} – ${fmtDate(end)}`;

  return (
    <div className="group bg-paper rounded-xl border border-line overflow-hidden shadow-sm hover:shadow-md hover:border-maroon/20 hover:-translate-y-0.5 transition-all duration-300">

      <div className="aspect-[16/10] w-full relative overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-maroon to-gold flex items-center justify-center">
            <span className="text-white/90 font-bold text-3xl">M</span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="font-display font-semibold text-maroon text-sm leading-snug line-clamp-2 min-h-[2.25rem]">
          {title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-ink-soft">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">{timeDisplay}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-soft">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{venue}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
