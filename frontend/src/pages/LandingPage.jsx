import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <header>
        <nav>
          <a href="#top" className="logo">
            <span className="logo-pin" aria-hidden="true"></span>
            GopherEvent
          </a>
          <ul className="nav-links">
            <li><a href="#value">Why it exists</a></li>
            <li><a href="#features">What it does</a></li>
            <li><a href="#how">How it works </a></li>
          </ul>
          <div className="nav-cta">
            <Link to="/events" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "14px" }}>
              Browse events
            </Link>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="board-stack">
            <div className="notice flutter-in" style={{ "--rot": "-0.6deg", animationDelay: ".05s" }}>
              <span className="eyebrow">University of Minnesota — Twin Cities</span>
              <h1>Every flyer on campus.<br />One board.</h1>
              <p className="sub">
                GopherEvent pulls every club meeting, guest talk, and free-pizza night into one
                place you'll actually check — no muted GroupMe required.
              </p>
              <div className="cta-row">
                <Link to="/events" className="btn btn-primary">Browse events</Link>
                <Link to="/events/create" className="btn btn-ghost">Post an event</Link>
              </div>
            </div>

            <div className="flyer-row">
              <div className="flyer f1 pin-gold flutter-in" style={{ "--rot": "-7deg", animationDelay: ".2s" }}>
                <span className="tag orange">Career</span>
                <h3>Fall Involvement Fair</h3>
                <p className="meta mono">NORTHROP MALL<br />THU · 11:00 AM</p>
                <p className="stub">Tap to RSVP →</p>
              </div>
              <div className="flyer f2 pin-maroon flutter-in" style={{ "--rot": "6deg", animationDelay: ".3s" }}>
                <span className="tag blue">Watch party</span>
                <h3>Hockey vs. Wisconsin</h3>
                <p className="meta mono">COFFMAN UNION<br />FRI · 7:00 PM</p>
                <p className="stub">Tap to RSVP →</p>
              </div>
              <div className="flyer f3 pin-gold flutter-in" style={{ "--rot": "4deg", animationDelay: ".4s" }}>
                <span className="tag green">Free food</span>
                <h3>Late Night Breakfast</h3>
                <p className="meta mono">BAILEY DINING<br />TUE · 10:00 PM</p>
                <p className="stub">Tap to RSVP →</p>
              </div>
              <div className="flyer f4 pin-maroon flutter-in" style={{ "--rot": "-5deg", animationDelay: ".5s" }}>
                <span className="tag orange">Tech</span>
                <h3>Hackathon Kickoff</h3>
                <p className="meta mono">WALTER LIBRARY<br />SAT · 9:00 AM</p>
                <p className="stub">Tap to RSVP →</p>
              </div>
              <div className="flyer f5 pin-gold flutter-in" style={{ "--rot": "9deg", animationDelay: ".6s" }}>
                <span className="tag blue">Panel</span>
                <h3>CS Career Panel</h3>
                <p className="meta mono">KELLER HALL<br />WED · 4:00 PM</p>
                <p className="stub">Tap to RSVP →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contrast" id="value">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why it exists</span>
            <h2>You shouldn't need six apps to find one event.</h2>
          </div>
          <div className="contrast-grid">
            <div className="contrast-col reveal">
              <h3>Where it used to live</h3>
              <div className="scatter">
                <div className="note n1">A GroupMe you muted in October.</div>
                <div className="note n2">An email buried under three newsletters.</div>
                <div className="note n3">An Instagram story that's already gone.</div>
                <div className="note n4">A flyer that fell off the wall in Dinkytown.</div>
              </div>
            </div>
            <div className="contrast-col reveal">
              <h3>Where it lives now</h3>
              <div className="clean-card">
                <div className="clean-item">
                  <span className="dot" aria-hidden="true"></span>
                  <span className="txt"><strong>Fall Involvement Fair</strong><span>NORTHROP MALL · THU 11:00 AM</span></span>
                </div>
                <div className="clean-item">
                  <span className="dot" aria-hidden="true"></span>
                  <span className="txt"><strong>Hackathon Kickoff</strong><span>WALTER LIBRARY · SAT 9:00 AM</span></span>
                </div>
                <div className="clean-item">
                  <span className="dot" aria-hidden="true"></span>
                  <span className="txt"><strong>Late Night Breakfast</strong><span>BAILEY DINING · TUE 10:00 PM</span></span>
                </div>
                <p className="foot">One board, one link: <b>gopherevent.com</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What it does</span>
            <h2>Built to fit how campus actually runs</h2>
            <p>No new habits to learn. Just the events, in one place, when you need them.</p>
          </div>
          <div className="features-grid">
            <div className="feature reveal">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" /><circle cx="15.5" cy="15.5" r="2.2" /><path d="M17.1 17.1L19 19" /></svg>
              </div>
              <h3>Discover</h3>
              <p>See what's happening this week, filtered by what you're actually into — sports, careers, or the free food line.</p>
            </div>
            <div className="feature reveal">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.3l2.3 2.3 4.7-4.9" /></svg>
              </div>
              <h3>RSVP in one tap</h3>
              <p>No forms, no forwarding an email chain to your group chat. Tap once and you're on the list.</p>
            </div>
            <div className="feature reveal">
              <div className="icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a5 5 0 0 0-5 5v3.5L5 15h14l-2-3.5V8a5 5 0 0 0-5-5z" /><path d="M9.5 18a2.5 2.5 0 0 0 5 0" /></svg>
              </div>
              <h3>Reminders that land</h3>
              <p>A heads-up before doors open, sent straight to your inbox — not lost in a spam folder.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Three taps, start to finish</h2>
          </div>
          <div className="steps">
            <div className="step reveal">
              <div className="num mono">01</div>
              <h3>Find something happening</h3>
              <p>Browse by day, building, or organization — no scrolling through three different apps.</p>
              <div className="step-line" aria-hidden="true"></div>
            </div>
            <div className="step reveal">
              <div className="num mono">02</div>
              <h3>RSVP</h3>
              <p>One tap and you're on the list. The host knows you're coming, and so do you.</p>
              <div className="step-line" aria-hidden="true"></div>
            </div>
            <div className="step reveal">
              <div className="num mono">03</div>
              <h3>Get a nudge</h3>
              <p>A reminder lands in your inbox before it starts, so it doesn't slip your mind.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" id="get-started">
        <div className="wrap">
          <h2>Stop finding out about it after it's over.</h2>
          <p>Every college, every club, every free-pizza night — on one board at gopherevent.com.</p>
          <div className="cta-row">
            <Link to="/events" className="btn btn-on-maroon">Browse this week's events</Link>
            <Link to="/events/create" className="btn" style={{ border: "2px solid var(--cream)", color: "var(--cream)" }}>
              Post an event
            </Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <a href="#top" className="logo">
                <span className="logo-pin" aria-hidden="true"></span>
                GopherEvent
              </a>
              <p className="foot-tag">
                Built by a CS student who was tired of missing free pizza. One board for everything
                happening on campus.
              </p>
            </div>
            <ul className="foot-links">
              <li><a href="#value">Why it exists</a></li>
              <li><a href="#features">What it does</a></li>
              <li><a href="#how">How it works</a></li>
            </ul>
          </div>
          <div className="foot-bottom">
            <span>gopherevent.com</span>
            <span>© 2026 GopherEvent · University of Minnesota, Twin Cities</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;