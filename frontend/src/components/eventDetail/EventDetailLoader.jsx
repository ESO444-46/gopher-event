const ShimmerBlock = ({ className = "" }) => (
  <div className={`event-detail-skeleton-block ${className}`} aria-hidden="true" />
);

const EventDetailLoader = () => (
  <div className="min-h-screen bg-cream" aria-busy="true" aria-label="Loading event details">
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <ShimmerBlock className="aspect-[16/9] sm:aspect-[11/5] rounded-xl" />
    </div>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-4">
            <ShimmerBlock className="h-8 w-48" />
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-11/12" />
            <ShimmerBlock className="h-4 w-8/12" />
          </section>
          <div className="border-t border-line" />
          <section className="space-y-5">
            <ShimmerBlock className="h-8 w-52" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ShimmerBlock className="h-36 rounded-2xl" />
              <ShimmerBlock className="h-36 rounded-2xl" />
            </div>
            <ShimmerBlock className="h-24 rounded-2xl" />
          </section>
        </div>
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-line bg-paper p-6 space-y-6">
            <ShimmerBlock className="h-10 w-24" />
            <ShimmerBlock className="h-12 w-full rounded-xl" />
            <ShimmerBlock className="h-48 w-full rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export default EventDetailLoader;
