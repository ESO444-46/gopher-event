import { useCallback, useState } from "react";
import PassScanner from "../components/checkIn/PassScanner";
import "./CheckInPage.css";

const CheckInPage = () => {
  const [scan, setScan] = useState(null);
  const handleScan = useCallback((decodedValue) => {
    setScan({ decodedValue, isEventPass: decodedValue.startsWith("gopherevent://pass/") });
  }, []);

  return (
    <main className="checkin-page">
      <section className="checkin-card">
        <p className="checkin-kicker">ORGANIZER TOOL</p>
        <h1>Check in an attendee</h1>
        <p className="checkin-copy">Scan the QR code on their Event Pass.</p>
        <PassScanner onScan={handleScan} />
        {scan && <div className={`checkin-result ${scan.isEventPass ? "checkin-result-valid" : "checkin-result-invalid"}`}>
          <strong>{scan.isEventPass ? "Event pass detected" : "This is not an Event Pass QR code"}</strong>
          <code>{scan.decodedValue}</code>
          <p>This preview only reads the QR. Connect it to a secure backend check-in endpoint before a real event.</p>
        </div>}
      </section>
    </main>
  );
};

export default CheckInPage;
