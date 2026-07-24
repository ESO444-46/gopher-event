import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";
import SignupPage from "./pages/SignupPage";
import VerifyEmail from "./pages/VerifyEmail";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import CreateEvent from "./pages/CreateEvent";
import EventDetailPage from "./pages/EventDetailPage";
import LandingPage from "./pages/LandingPage";
import TicketDesignsPage from "./pages/TicketDesignsPage";
import CheckInPage from "./pages/CheckInPage";

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/ticket-designs" element={<TicketDesignsPage/>} />
          <Route path="/check-in" element={<CheckInPage/>} />
          {/* Authentication Routes */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Core Event Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:publicId" element={<EventDetailPage />} />

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
