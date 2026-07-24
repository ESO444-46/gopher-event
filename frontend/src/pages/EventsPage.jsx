import { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import NavBar from "../components/events/NavBar";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const EventCardSkeleton = () => (
  <div className="event-card-skeleton" aria-hidden="true">
    <div className="event-card-skeleton-image" />
    <div className="event-card-skeleton-content">
      <div className="event-card-skeleton-line event-card-skeleton-title" />
      <div className="event-card-skeleton-line event-card-skeleton-meta" />
      <div className="event-card-skeleton-line event-card-skeleton-meta event-card-skeleton-meta-short" />
    </div>
  </div>
);

const EventsPage = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const { showToast } = useToast()

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await api.get("/events/")
                setEvents(result.data.events)
            } catch (error) {
                const errorMessage = error.response?.data?.message ?? "Failed to load events"
                showToast("error", errorMessage)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
    <div className="min-h-screen bg-cream">

      <NavBar setEvents={setEvents} setLoading={setLoading} />

    <div className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">

        {loading && (
          <>
            <div className="mb-9">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
                Discover campus life
              </p>
              <h1 className="font-display text-3xl font-semibold text-maroon sm:text-4xl">
                Upcoming Events
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" aria-label="Loading events">
              {Array.from({ length: 6 }, (_, index) => <EventCardSkeleton key={index} />)}
            </div>
          </>
        )}

        {!loading && events.length > 0 && (
          <>
            <div className="mb-9">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
                Discover campus life
              </p>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-semibold text-maroon sm:text-4xl">
                    Upcoming Events
                  </h1>
                  <p className="mt-2 text-sm text-ink-soft sm:text-base">
                    Find something worth putting on your calendar.
                  </p>
                </div>
                <span className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft">
                {events.length} event{events.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {events.map((event) => (
                <Link className="no-underline text-inherit" key={event.publicId} to={`/events/${event.publicId}`}>
                  <EventCard
                    title={event.title}
                    venue={event.venue}
                    startsAt={event.startsAt}
                    endsAt={event.endsAt}
                    imageUrl={event.thumbnailUrl}
                  />
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && events.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto h-16 w-16 bg-line/40 rounded-2xl flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-ink-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-sans text-ink font-semibold">No events yet</h3>
            <p className="mt-1 text-ink-soft text-sm">Check back later for upcoming events!</p>
          </div>
        )}

      </div>
    </div>

    </div>
  );
};

export default EventsPage;
