import { useState } from "react";
import Spinner from "./Spinner";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import CapacityDisplay from "../../pages/CapacityDisplay";
import { Link } from "react-router-dom";

const EventActions = ({ eventId, publicId, capacity, totalRSVPs }) => {
  const [loading, setLoading] = useState(false);
  const [rsvp, setRsvp] = useState(false);
  const { showToast } = useToast();
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  
  async function handleRsvp() {
    setLoading(true);
    try {
      const result = await api.post(
        `/events/${publicId}/rsvp`,
        {}
      );
      if (result.data.success) {
        setRsvp(true);
        showToast("success", "RSVP confirmed!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ?? "Failed to RSVP";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper shadow-sm overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-maroon to-gold" />

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-ink">Free</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100">
            Registration Required
          </span>
        </div>

        {isAuthenticated ? <button
          onClick={handleRsvp}
          disabled={loading || rsvp}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
            ${rsvp
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-600"
              : "bg-maroon hover:bg-maroon-dark hover:shadow-lg hover:-translate-y-0.5 focus:ring-maroon"
            }`}
        >
          {loading ? (
            <>
              <Spinner />
              Reserving...
            </>
          ) : rsvp ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You're Going!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Reserve your spot
            </>
          )}
        </button> : (
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-maroon shadow-md transition-all hover:bg-maroon-dark hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Log in to reserve
          </Link>
        )}
        <CapacityDisplay registered={totalRSVPs} capacity={capacity}/>
      </div>
    </div>
  );
};

export default EventActions;
