import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./PassScanner.css";

const PassScanner = ({ onScan }) => {
  const rawId = useId();
  const scannerId = `event-pass-scanner-${rawId.replace(/:/g, "")}`;
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [status, setStatus] = useState("Starting camera…");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode(scannerId);
    scannerRef.current = scanner;
    let isActive = true;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
      (decodedText) => {
        if (hasScannedRef.current) return;
        hasScannedRef.current = true;
        scanner.pause(true);
        setStatus("Pass detected");
        onScan(decodedText);
      },
      () => {}
    ).then(() => {
      if (isActive) setStatus("Point the camera at an event pass QR code");
    }).catch(() => {
      if (isActive) setCameraError("Camera access is needed to scan a pass. Allow camera permission, then try again.");
    });

    return () => {
      isActive = false;
      if (scanner.isScanning) scanner.stop().catch(() => {});
      scanner.clear().catch(() => {});
    };
  }, [onScan, scannerId]);

  const scanNext = () => {
    hasScannedRef.current = false;
    setStatus("Point the camera at the next event pass");
    scannerRef.current?.resume();
  };

  return (
    <div className="pass-scanner">
      <div className="pass-scanner-video-wrap">
        <div id={scannerId} className="pass-scanner-video" />
        <div className="pass-scanner-frame" aria-hidden="true"><span /></div>
      </div>
      <p className="pass-scanner-status">{cameraError || status}</p>
      {cameraError && <button className="pass-scanner-retry" onClick={() => window.location.reload()}>Try again</button>}
      {!cameraError && <button className="pass-scanner-next" onClick={scanNext}>Scan next pass</button>}
    </div>
  );
};

export default PassScanner;
