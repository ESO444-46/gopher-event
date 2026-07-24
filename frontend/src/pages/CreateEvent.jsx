import { useState } from "react";
import TopNav from "../components/createEvent/TopNav";
import Spinner from "../components/SpinnerComponent";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const CreateEvent = () => {
    const [title, setTitle] = useState('')
    const [description,setDescription] = useState("")
    const [venue, setVenue] = useState("")
    const [thumbnailUrl, setThumbnailUrl] = useState("")
    const [bannerUrl, setBannerUrl] = useState("")
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    {/* add these two state lines near your other useState calls */}
    const [hasCapacity, setHasCapacity] = useState(false);
    const [capacity, setCapacity] = useState("");
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { showToast } = useToast()


    async function handleSubmission (e){
        e.preventDefault();
        setLoading(true)


        try {
            const result = await api.post(
                `/events`,
                {
                    title,
                    description,
                    venue,
                    thumbnailUrl,
                    bannerUrl: bannerUrl || null,
                    capacity: hasCapacity ? Number(capacity) : null,
                    startsAt: new Date(startsAt).toISOString(),
                    endsAt: new Date(endsAt).toISOString(),
                }
            );
            const {publicId} = result.data.event
            showToast("success", "Event created!")
            navigate(`/events/${publicId}`)


            }catch(error){
              const errorMessage = error.response?.data?.message ?? "Failed to create event"
              showToast("error", errorMessage)
            }finally{
                setLoading(false)
            }
        }

  return (
    <div className="create-event-page min-h-screen">
      
      {/* Top Nav */}
      <TopNav/>

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Page Header */}
        <div className="mb-8">
          <p className="page-kicker mb-2">Host an event</p>
          <h1 className="font-display text-3xl font-semibold text-maroon">Create Event</h1>
          <p className="page-subtitle mt-2 text-sm">Fill in the details for your campus event.</p>
        </div>

        {/* Form Card */}
        <div className="create-event-card rounded-2xl p-6 sm:p-8">
          <form onSubmit = {handleSubmission}className="space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Event Title
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                required
                placeholder="e.g., Community Hackathon 2026"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Tell people what your event is about..."
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm resize-y"
              />
            </div>

            {/* Banner Image URL */}
            <div>
              <label htmlFor="bannerUrl" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Banner Image URL (optional)
              </label>
              <input
                id="bannerUrl"
                name="bannerUrl"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                type="url"
                placeholder="Used for the event detail page header"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
              />
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Venue
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  id="venue"
                  name="venue"
                  value={venue}
                  type="text"
                  onChange={(e) => setVenue(e.target.value)}
                  required
                  placeholder="e.g., Coffman Memorial Union"
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="capacityToggle" className="block text-sm font-semibold text-gray-700">
                  Limit capacity
                </label>
                <button
                  id="capacityToggle"
                  type="button"
                  role="switch"
                  aria-checked={hasCapacity}
                  onClick={() => {
                    setHasCapacity(!hasCapacity);
                    if (hasCapacity) setCapacity("");
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a0019] ${
                    hasCapacity ? "bg-[#7a0019]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasCapacity ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {hasCapacity && (
                <div className="mt-3">
                  <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Max capacity
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required={hasCapacity}
                    placeholder="e.g., 50"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Image URL */}
            <div>
              <label htmlFor="thumbnailUrl" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Thumbnail Image URL <span className="text-red-500">*</span>
              </label>
              <input
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                type="url"
                required
                placeholder="Used for the event grid card image"
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Starts At */}
              <div>
                <label htmlFor="startsAt" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Starts At <span className="text-red-500">*</span>
                </label>
                <input
                  id="startsAt"
                  name="startsAt"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                  type="datetime-local"
                  onClick={(e) => e.target.showPicker?.()}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                />
              </div>

              {/* Ends At */}
              <div>
                <label htmlFor="endsAt" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Ends At <span className="text-red-500">*</span>
                </label>
                <input
                  id="endsAt"
                  name="endsAt"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  type="datetime-local"
                  onClick={(e) => e.target.showPicker?.()}
                  required
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                />
              </div>

            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                disabled = {isLoading}
                type="submit"
                className="w-full flex iterms-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#7a0019] hover:bg-[#5a0012] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a0019] transition-colors shadow-sm"
              >
            {isLoading ? (
                <div className=" flex items-center justify-center gap-2">
                    <Spinner />
                    Creating...
                </div>
            ) : (                  
                ("Create Event")
            )}
              </button>
            </div>

          </form>
        </div>
          
      </main>
    </div>
  );
};

export default CreateEvent;
