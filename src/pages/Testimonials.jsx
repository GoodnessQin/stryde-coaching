import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BackToTop from '../components/BackToTop.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';
import useTestimonials, { withBreaks } from '../hooks/useTestimonials.jsx';

export default function Testimonials() {
  const items = useTestimonials();
  useScrollAnimations([items]);

  return (
    <>
      <PageStyles page="testimonials" />
      <Navbar />

      {/* Testimonials Hero Section */}
      <section className="testimonials-hero">
        <div className="testimonials-hero-bg"></div>
        <div className="testimonials-hero-circle"></div>
        <div className="container">
          <div className="testimonials-hero-content Fade-in">
            <h1> Client Reflections</h1>
            <p className="hero-subtitle">Insights from professionals we’ve supported...</p>
          </div>
        </div>
      </section>

      {/* Testimonials Content Section */}
      <section className="testimonials-content-section">
        <div className="container">
          {items.map((t) => (
            <div className="testimonial-item section-animate" key={t.id}>
              <div className="testimonial-content">
                <h2>{t.name.toUpperCase()}</h2>
                <p className="testimonial-credentials">{withBreaks(t.credentials.toUpperCase())}</p>
              </div>

              <div className="testimonial-image-wrapper">
                <div className="quote-mark slide-in-left">"</div>
                <div className="testimonial-photo slide-in-left">
                  <img src={t.photo} alt={t.alt} />
                </div>
              </div>
              <div className="testimonial-text-wrapper">
                {t.paragraphs.map((p, i) => (
                  <p className="testimonial-text" key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer fadeOnFooter />
      <BackToTop />
    </>
  );
}
