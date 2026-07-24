import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const searchPlaceholders = [
  "stress-buster events this week",
  "free food on campus today",
  "networking events for CS majors",
  "study groups near Coffman Union",
  "hackathons happening this month",
  "career fairs before December",
  "international student mixers",
  "outdoor events this weekend",
  "workshops on resume building",
  "events with free swag",
  "club meetings tonight",
  "research talks in Keller Hall",
];

const NavBar = ({ setEvents, setLoading }) => {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const example = searchPlaceholders[exampleIndex];
    const isComplete = typedLength === example.length;
    const delay = isComplete && !isDeleting ? 1600 : isDeleting ? 35 : 60;

    const timeoutId = setTimeout(() => {
      if (!isDeleting && !isComplete) {
        setTypedLength((length) => length + 1);
      } else if (!isDeleting) {
        setIsDeleting(true);
      } else if (typedLength > 0) {
        setTypedLength((length) => length - 1);
      } else {
        setExampleIndex((index) => (index + 1) % searchPlaceholders.length);
        setIsDeleting(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [exampleIndex, isDeleting, typedLength]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    setLoading(true);
    try {
      const result = await api.get("/events", { params: { search: input } });
      setEvents(result.data.events);
    } catch (error) {
      const errorMessage = error.response?.data?.message ?? "Failed to search events";
      showToast("error", errorMessage);
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-5 sm:gap-7">

        {/* Logo — fixed width */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-paper border border-line shadow-sm">
            <span className="text-maroon font-display font-semibold text-sm">M</span>
          </div>
          <span className="font-display text-lg font-semibold text-maroon tracking-tight hidden sm:inline">
            Gopher Event
          </span>
        </Link>

        {/* Search — grows but caps out, sits close to logo instead of dead-center */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              disabled={isSearching}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`${searchPlaceholders[exampleIndex].slice(0, typedLength)}`}
              aria-label="Search events by topic, description, or location"
              className="block w-full h-10 pl-4 pr-10 bg-paper border border-line rounded-full text-sm text-ink placeholder-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute inset-y-0 right-0 w-10 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <svg className="animate-spin h-4 w-4 text-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-4 w-4 text-ink-soft hover:text-maroon transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Avatar — pushed to far right via ml-auto */}
        <nav className="ml-auto flex items-center gap-2 sm:gap-4" aria-label="Account actions">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-maroon sm:inline"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="hidden text-sm font-medium text-ink-soft transition-colors hover:text-maroon sm:inline"
          >
            Sign up
          </Link>
          <Link
            to="/events/create"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-maroon px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-maroon-dark sm:px-4"
          >
            <span className="sm:hidden" aria-hidden="true">+</span>
            <span className="hidden sm:inline">Create event</span>
            <span className="sr-only sm:hidden">Create event</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
