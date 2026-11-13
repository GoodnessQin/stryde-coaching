import { Link } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Marquee from '../components/Marquee.jsx';
import BackToTop from '../components/BackToTop.jsx';
import useScrollAnimations from '../hooks/useScrollAnimations.js';

const MARQUEE = [
  'Let’s take Audacious Strydes Together',
  'Let’s Take Audacious Strydes Together',
  'Let’s Take Audacious Strydes Together',
  'Let’s Take Audacious Strydes Together',
];

const VALUES = [
  { title: 'ALIGNMENT', text: "I believe work must feel congruent with your values, and work are aligned, not when you're simply performing." },
  { title: 'CAPACITY BUILDING', text: "I don't just help you move. I help you grow strong enough to sustain where you're going." },
  { title: 'INTEGRITY', text: 'No gimmicks, no false promises, just honest, grounded insight, and support that respects your journey.' },
  { title: 'COMPASSION', text: 'Real growth happens in safe containers. I create space for understanding that everyone carries unseen pressures and untold stories.' },
  { title: 'CLARITY', text: 'I help you untangle confusion, quiet the noise, and make decisions from a place of truth rather than fear or expectation.' },
];

const CheckIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
    <circle cx="15" cy="15" r="12" stroke="#CBB484" strokeWidth="2" />
    <path d="M9 15L13 19L21 11" stroke="#CBB484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function About() {
  useScrollAnimations();
  return (
    <>
      <PageStyles page="about" />
      <Navbar />

      {/* About Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="container">
          <div className="about-hero-header fade-in">
            <h1>Meet Chiamaka</h1>
            <p className="hero-subtitle">FOUNDER, STRYDE COACHING</p>
          </div>
        </div>
      </section>

      {/* Hero Content Box (Overlapping) */}
      <section className="hero-content-box section-animate">
        <div className="container">
          <div className="content-box">
            <p>Chiamaka brings 10 years of hands-on experience supporting people through some of the most defining moments of their working lives  from entering new roles, navigating workplace challenges, to growing into leadership and long-term career fulfilment.</p>
            <p>As a Career Coach and Mentor, Chiamaka brings a deep and practical understanding of how careers truly unfold within organisations — not in theory, but in real workplaces shaped by pressure, change, and competing demands.</p>
            <p>Working closely with people every day, she has supported individuals through some of the most defining seasons of their professional lives — from navigating the ache of unfulfilling roles to rebuilding confidence, recovering from burnout, managing transitions, pursuing growth, and embracing reinvention.</p>
            <p>She understands how personal struggles often show up in professional spaces — and how unresolved life issues can quietly limit potential. What truly sets her apart is her ability to hold space, listen deeply, and help people make sense of their experiences — without judgment and without pressure.</p>
            <p>Chiamaka supports clients in navigating real-world challenges: career pivots, identity shifts, self-doubt, decision fatigue, workplace anxiety, leadership readiness, and life transitions that demand both courage and clarity. Her approach blends structure with compassion, strategy with self-awareness, and accountability with grace.</p>
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE} />

      {/* About Stryde Content Section */}
      <section className="about-stryde-section section-animate">
        <div className="container">
          <div className="about-stryde-content">
            <div className="about-image-container">
              <div className="about-main-image">
                <img src="/assets/images/aboutstryde.jpeg" alt="Chiamaka" />
              </div>
              <div className="success-result-card fade-in">
                <div className="percentage-circle">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#FFF4DC" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#CBB484" strokeWidth="6"
                      strokeDasharray="264" strokeDashoffset="26.4"
                      transform="rotate(-90 50 50)" strokeLinecap="round" />
                  </svg>
                  <div className="percentage-text">98%</div>
                </div>
                <div className="card-header">
                  <div className="badge-text">
                    <span className="badge-title">Success</span>
                    <span className="badge-subtitle">Result</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-text-content">
              <h3>About Stryde Coaching</h3>
              <p>Stryde Coaching supports professionals in accessing the clarity and confidence they already carry within but cannot fully access. I meet them exactly where they are—often tangled in the weight of their own voices, doubts, and pressures—and help them transform, creating sustainable momentum in their careers and lives.</p>
              <p>My coaching approach is structured yet reflective, combining honest self-evaluation with practical action. Every session is approached with care, curiosity, and an expectation that real growth is possible no matter where someone is starting from.</p>
              <p>I don't offer quick fixes. I help you build capacity; emotionally, mentally, and practically, so you can move forward with a measured, consistent, and sustainable momentum all within you are becoming.</p>
              <Link to="/contact" target="_blank" className="btn-primary fade-in">BOOK A DISCOVERY CALL</Link>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE} reverse />

      {/* Our Values Section */}
      <section className="values-section section-animate">
        <div className="values-bg"></div>
        <div className="container scale-in">
          <h2 className="section-heading">OUR VALUES</h2>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card fade-in" key={v.title}>
                <div className="value-icon"><CheckIcon /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <div className="values-cta scale-in">
            <Link to="/contact" target="_blank" className="btn-tertiary fade-in">BOOK A DISCOVERY CALL</Link>
          </div>
        </div>
      </section>

      <Footer socialNewTab />
      <BackToTop />
    </>
  );
}
