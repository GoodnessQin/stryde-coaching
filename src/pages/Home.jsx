import { Link } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import PageLoader from '../components/PageLoader.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Marquee from '../components/Marquee.jsx';
import BackToTop from '../components/BackToTop.jsx';
import WhoCarousel from '../components/WhoCarousel.jsx';
import StatsSection from '../components/StatsSection.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import useTestimonials, { withBreaks } from '../hooks/useTestimonials.jsx';
import { CALENDAR_URL } from '../data/site.js';

const MARQUEE = [
  "Let's take Audacious Strydes Together",
  "Let's Take Audacious Strydes Together",
  "Let's Take Audacious Strydes Together",
  "Let's Take Audacious Strydes Together",
];

export default function Home() {
  const testimonials = useTestimonials();
  const featured = testimonials.filter((t) => t.featured).slice(0, 3);
  const cards = featured.length ? featured : testimonials.slice(0, 3);
  useScrollAnimations([testimonials]);

  return (
    <>
      <PageStyles page="home" />
      <PageLoader />
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <h1 className="hero-title scale-in">Professional career coaching for clarity, direction and growth.</h1>
          <p className="hero-subtitle scale-in">Stryde Coaching supports professionals in accessing the clarity and confidence they already carry within but cannot fully access. We meet professionals exactly where they are, often tangled in the weight of their own voices, doubts, and pressures, and help them transform, creating sustainable momentum in their careers and lives.</p>
          <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary scale-in">BOOK A DISCOVERY CALL</a>
        </div>
      </section>

      <Marquee items={MARQUEE} />

      {/* Testimonials Section */}
      <section className="testimonials-section section-animate">
        <div className="container fade-in">
          <div className="testimonials-grid">
            {cards.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-image">
                  <img src={t.photo} alt={t.homeAlt || t.alt} />
                </div>
                <h3>{t.homeName || t.name}</h3>
                <p className="testimonial-title">{withBreaks(t.homeCredentials ?? t.credentials)}</p>
                {(t.homeParagraphs || t.paragraphs.slice(0, 2)).map((p, i) => (
                  <p className="testimonial-text" key={i}>{p}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/testimonials" target="_blank" className="btn-secondary fade-in">SEE MORE TESTIMONIALS</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section section-animate ">
        <div className="services-bg"></div>
        <div className="container services-content fade-in">
          <h2>SERVICES.</h2>
          <Link to="/services" target="_blank" className="btn-primary fade-in">SEE SERVICES</Link>
        </div>
      </section>

      <StatsSection />

      {/* Who Is This For Section */}
      <section className="who-section section-animate">
        <div className="container">
          <h2 className="section-title fade-in">WHO IS THIS FOR?</h2>
          <p className="section-subtitle fade-in">STRYDE COACHING IS FOR PROFESSIONALS WHO WANT TO</p>
          <WhoCarousel />
        </div>
      </section>

      <Marquee items={MARQUEE} reverse />

      {/* Meet Chiamaka Section */}
      <section className="meet-section section-animate">
        <div className="meet-bg"></div>
        <div className="container meet-container">
          <div className="meet-image slide-in-left">
            <img src="/assets/images/meetpfp.webp" alt="Chiamaka" />
          </div>
          <div className="meet-content slide-in-right">
            <h2>MEET<br />CHIAMAKA.</h2>
            <p>Chiamaka brings 10 years of hands-on experience supporting people through some of the most defining moments of their working lives, from entering new roles, navigating workplace challenges, to growing into leadership and long-term career fulfilment.</p>
            <Link to="/about" target="_blank" className="btn-tertiary fade-in">ABOUT CHIAMAKA</Link>
          </div>
        </div>
      </section>

      <Footer socialNewTab />
      <BackToTop />
    </>
  );
}
