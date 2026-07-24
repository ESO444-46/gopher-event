import { QRCodeSVG } from "qrcode.react";
import "./EventPass.css";

const formatDate = (startsAt) => {
  if (!startsAt) return "Sunday, October 25";
  return new Date(startsAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (startsAt) => {
  if (!startsAt) return "6:00 AM";
  return new Date(startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Presentational only: give qrValue a server-issued, signed check-in token
 * once RSVP logic is connected. This component makes no API calls.
 */
const EventPass = ({
  title = "Open Source Contribution Sprint",
  startsAt,
  venue = "McNamara Alumni Center",
  bannerUrl,
  qrValue = "gopherevent://pass/demo",
  ticketCode = "GE · 7K4P · 208",
  status = "Confirmed",
}) => {
  return (
    <article className="event-pass" aria-label={`${title} event pass`}>
      <div
        className="event-pass-photo"
        style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : undefined}
      >
        <div className="event-pass-photo-overlay" />
        <div className="event-pass-photo-content">
          <span>GOPHER EVENT</span>
          <p><b>✓</b> RSVP CONFIRMED</p>
        </div>
      </div>

      <div className="event-pass-details">
        <p className="event-pass-kicker">EVENT PASS</p>
        <h2>{title}</h2>

        <div className="event-pass-route" aria-hidden="true">
          <i />
          <span />
          <i />
        </div>

        <div className="event-pass-info">
          <div>
            <span>DATE</span>
            <strong>{formatDate(startsAt)}</strong>
          </div>
          <div>
            <span>ENTRY</span>
            <strong>{formatTime(startsAt)}</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong>{status}</strong>
          </div>
        </div>
        <p className="event-pass-venue">{venue}</p>
      </div>

      <div className="event-pass-stub">
        <div className="event-pass-qr">
          <QRCodeSVG
            value={qrValue}
            size={176}
            level="M"
            marginSize={4}
            bgColor="#fffdf9"
            fgColor="#2a2320"
            title="Event check-in QR code"
          />
        </div>
        <div className="event-pass-stub-copy">
          <span>CHECK-IN PASS</span>
          <strong>{ticketCode}</strong>
          <small>Scan on arrival</small>
        </div>
      </div>
    </article>
  );
};

export default EventPass;
