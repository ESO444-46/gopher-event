import EventPass from "../components/eventDetail/EventPass";
import "./TicketDesignsPage.css";

const TicketDesignsPage = () => (
  <main className="ticket-page">
    <div className="ticket-page-intro">
      <p className="ticket-page-kicker">RSVP SUCCESS · SELECTED DIRECTION</p>
      <h1>Your event pass.</h1>
      <p>Photo-led event details, a clean ticket layout, and a real generated QR code ready for a future check-in flow.</p>
    </div>
    <div className="ticket-pass-preview">
      <EventPass />
    </div>
  </main>
);

export default TicketDesignsPage;
