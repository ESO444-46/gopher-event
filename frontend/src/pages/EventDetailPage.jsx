import EventHero from "../components/eventDetail/EventHero";
import EventDescription from "../components/eventDetail/EventDesciption";
import WhenWhere from "../components/eventDetail/WhenWhere";
import EventCreator from "../components/eventDetail/EventCreator";
import EventActions from "../components/eventDetail/EventActions";
import EventDetailLoader from "../components/eventDetail/EventDetailLoader";
import api from "../api/axios";

import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import CapacityDisplay from "./CapacityDisplay";

const EventDetailPage = () => {
  const {publicId } = useParams()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [publicId]);

  useEffect(() => {
      async function fetchEvent(){
        try{

          const result = await api.get(`/events/${publicId}`)
          console.log(result)
          setDetails(result.data.event)

        }catch{
          setError(true)

        }finally{
          setLoading(false)        
        }
      }  
      fetchEvent()
  },[publicId])

  useEffect(() => {
    if (!details) return;

    const title = `${details.title} | Gopher Event`;
    const description = details.description || "Discover this event on Gopher Event.";
    document.title = title;

    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.href);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", window.location.href);
  }, [details]);

  if (error) return <div>
    Something went wrong
  </div>

  if (loading) return <EventDetailLoader></EventDetailLoader>

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero with background image + back/share buttons */}
      <EventHero
      title = {details.title}
      bannerUrl = {details.bannerUrl}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2 event-detail-content">

            <EventDescription
             description = {details.description}
            />

            {/* Divider */}
            <div className="event-detail-divider" />

            <WhenWhere
              startsAt = {details.startsAt}
              endsAt = {details.endsAt}
              venue = {details.venue}
            />

            {/* Divider */}
            <div className="event-detail-divider" />
            <EventCreator
             firstName={details.creator.firstName}
             lastName={details.creator.lastName}
            />
          </div>

          {/* Right Column — Sticky Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <EventActions
              publicId={publicId}
              eventId={details.id}
              totalRSVPs = {details.totalRSVPs}
              capacity = {details.capacity}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default EventDetailPage;
