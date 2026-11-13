import { useCallback, useEffect, useRef, useState } from 'react';
import { CALENDAR_URL } from '../data/site.js';

const SERVICES = [
  { img: 'service-card-1.webp', alt: 'Career Strategy Sessions', title: 'Career Strategy Sessions', text: 'Personalised one-to-one sessions designed to help you gain clarity, build confidence, and take purposeful next steps in your career.' },
  { img: 'service-card-2.webp', alt: 'Career Coaching', title: 'Career Coaching & Mentoring', text: 'A personalised, long-term coaching partnership focused on helping you grow with clarity and confidence.' },
  { img: 'service-card-3.png', alt: 'Group Coaching', title: 'Group Coaching Sessions', text: 'Experience powerful, guided group coaching designed to help you gain clarity, build confidence, and move forward with purpose.' },
];

const ServiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="#CBB484" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="3" fill="#CBB484" />
  </svg>
);

/** Featured services slider + port of "8. SERVICES SLIDER" */
export default function ServicesSlider() {
  const total = SERVICES.length;
  const [current, setCurrent] = useState(0);
  const interval = useRef(null);
  const hovering = useRef(false);
  const resumeTimer = useRef(null);

  const go = useCallback((n) => setCurrent(((n % total) + total) % total), [total]);
  const stop = () => { clearInterval(interval.current); interval.current = null; };
  const start = () => {
    if (!hovering.current && !interval.current) {
      interval.current = setInterval(() => setCurrent((c) => (c + 1) % total), 3000);
    }
  };
  const manual = (n) => {
    stop();
    go(n);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { if (!hovering.current) start(); }, 2000);
  };

  useEffect(() => {
    start();
    return () => { stop(); clearTimeout(resumeTimer.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const slideClass = (i) => {
    if (i === current) return 'service-card slide-center active';
    return 'service-card ' + (i < current ? 'slide-left' : 'slide-right');
  };

  return (
    <>
      <div
        className="services-slider"
        onMouseEnter={() => { hovering.current = true; stop(); }}
        onMouseLeave={() => { hovering.current = false; start(); }}
      >
        <button className="slider-arrow slider-arrow-prev" onClick={() => manual(current - 1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" /></svg>
        </button>
        <button className="slider-arrow slider-arrow-next" onClick={() => manual(current + 1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" /></svg>
        </button>

        {SERVICES.map((s, i) => (
          <div className={slideClass(i)} data-index={i} key={s.title}>
            <div className="service-card-image">
              <img src={`/assets/images/${s.img}`} alt={s.alt} />
            </div>
            <div className="service-card-content">
              <div className="service-tag">
                <span className="service-icon"><ServiceIcon /></span>
                <span>Live Session</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="btn-primary">BOOK A DISCOVERY CALL</a>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {SERVICES.map((_, i) => (
          <span key={i} className={'slider-dot' + (i === current ? ' active' : '')} data-slide={i} onClick={() => manual(i)}></span>
        ))}
      </div>
    </>
  );
}
