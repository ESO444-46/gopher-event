import { useState } from "react";
const EventHero = ({title, bannerUrl}) => {
  const [bannerError, setBannerError] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <div className="relative w-full aspect-[16/9] sm:aspect-[11/5] overflow-hidden rounded-xl shadow-[0_12px_28px_rgba(55,35,20,0.08)]">
        {bannerUrl && !bannerError ? (
          <img
            src={bannerUrl}
            alt=""
            onError={() => setBannerError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-maroon via-[#a33c2d] to-gold" />
        )}
      </div>
    </div>
  );
};

export default EventHero;
