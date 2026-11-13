import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Marquee from '../components/Marquee.jsx';
import BackToTop from '../components/BackToTop.jsx';
import ServicesSlider from '../components/ServicesSlider.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import { WHATSAPP_URL } from '../data/site.js';

const MARQUEE = [
  "Let's Take Audacious Strydes Together",
  "Let's Take Audacious Strydes Together",
  "Let's Take Audacious Strydes Together",
];

const EXTRA = [
  { n: '01', title: 'Ace my interview', text: 'Structured practice sessions with personalised feedback to strengthen your delivery and interview presence.' },
  { n: '02', title: 'Elevate my CV', text: 'In-depth CV refinement to highlight your strengths and position you competitively.' },
  { n: '03', title: 'Apply with confidence', text: 'Strategic guidance with applications, ensuring your experience is clearly aligned with each role.' },
  { n: '04', title: 'Enhance my LinkedIn presence', text: 'Professional profile enhancement to increase visibility, credibility, and career opportunities.' },
];

export default function Services() {
  useScrollAnimations();
  return (
    <>
      <PageStyles page="services" />
      <Navbar />

      <section className="services-hero">
        <div className="services-hero-bg"></div>
        <div className="container">
          <div className="services-hero-content fade-in">
            <h1>Featured Services</h1>
            <p className="hero-subtitle">Discover Your Path To Transformation</p>
            <p className="service-tagline">We help you clarify your goals and take the next steps with confidence. Our sessions are designed to give you practical guidance and direction.</p>
          </div>
        </div>
      </section>

      <section className="featured-services-section">
        <div className="container">
          <ServicesSlider />
        </div>
      </section>

      <Marquee items={MARQUEE} />

      {/* Additional Services Section */}
      <section className="additional-services-section">
        <div className="container">
          <h2 className="section-title-dark fade-in">EXPANDED SUPPORT SERVICES</h2>
          <div className="additional-services-content">
            <div className="additional-services-image">
              <div className="services-image-circle slide-in-left">
                <img src="/assets/images/amakaspfp.webp" alt="Chiamaka" />
              </div>
              <div className="services-cta-box">
                <p className="cta-text">Extra support. Deeper strategy. Stronger results.</p>
              </div>
            </div>

            <div>
              <div className="additional-services-list fade-in">
                {EXTRA.map((s) => (
                  <div className="service-item" key={s.n}>
                    <span className="service-number">{s.n}</span>
                    <div className="service-details">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="services-cta-box">
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="btn-primary fade-in">BOOK AN EXPANDED SUPPORT SERVICE</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
