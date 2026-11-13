import { useEffect, useRef, useState } from 'react';

const CARDS = [
  { img: 'who1.png', alt: 'Accelerate', title: 'ACCELERATE', text: 'Move faster toward promotions, leadership roles, or new opportunities.' },
  { img: 'who2.png', alt: 'Understand', title: 'UNDERSTAND', text: 'Gain clarity when feeling stuck or uncertain –Understand your strengths, goals, and next steps.' },
  { img: 'who3.png', alt: 'Gain Professional Identity', title: 'GAIN PROFESSIONAL IDENTITY', text: 'Build confidence to take on challenges and expand your impact.' },
  { img: 'who4.png', alt: 'Transition', title: 'TRANSITION', text: 'Navigate career changes with clarity, focus, and practical guidance.' },
  // Duplicate for seamless loop (content as in the original markup)
  { img: 'who1.png', alt: 'Accelerate', title: 'ACCELERATE', text: 'Move faster toward promotions, leadership roles, or new opportunities.' },
  { img: 'who2.png', alt: 'Understand', title: 'UNDERSTAND', text: 'Finally Carry What I Want & Step By Step Work With Mind, Body, Spirit Synergy To Clarify Vision' },
  { img: 'who3.png', alt: 'Gain Professional Identity', title: 'GAIN PROFESSIONAL IDENTITY', text: 'As An Clarity Who I Am So I Can Better Engage & Expand From Impact' },
  { img: 'who4.png', alt: 'Transition', title: 'TRANSITION', text: 'Navigate Career Transitions Or Move As Professional' },
];

const CARD_COUNT = 4; // number of original (non-duplicate) cards
const GAP = 30; // must match the CSS gap on .carousel-track
const SPEED = 0.5; // px per frame for auto-scroll
const SNAP_EASE = 0.15;

/** Port of "6. HOME CAROUSEL" from js/stryde.js */
export default function WhoCarousel() {
  const trackRef = useRef(null);
  const ctl = useRef({ nudge: () => {} });
  const [dotIdx, setDotIdx] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    track.style.animation = 'none';
    track.style.willChange = 'transform';

    let offset = 0;
    let targetOffset = 0;
    let isPaused = false;
    let isSnapping = false;
    let raf;

    const getCardStep = () => {
      const card = track.querySelector('.carousel-card');
      return card ? card.getBoundingClientRect().width + GAP : 330;
    };
    const getLoopWidth = () => getCardStep() * CARD_COUNT;

    const tick = () => {
      const loopWidth = getLoopWidth();
      if (isSnapping) {
        const diff = targetOffset - offset;
        if (Math.abs(diff) < 0.5) {
          offset = targetOffset;
          isSnapping = false;
          if (!track.matches(':hover')) isPaused = false;
        } else {
          offset += diff * SNAP_EASE;
        }
      } else if (!isPaused) {
        offset += SPEED;
        targetOffset = offset;
      }
      if (offset >= loopWidth) { offset -= loopWidth; targetOffset -= loopWidth; }
      if (offset < 0) { offset += loopWidth; targetOffset += loopWidth; }
      track.style.transform = 'translateX(' + -offset + 'px)';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => { isPaused = true; };
    const resume = () => { if (!isSnapping) isPaused = false; };
    let touchTimer;
    const onTouchEnd = () => { touchTimer = setTimeout(resume, 800); };

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', onTouchEnd, { passive: true });
    track.addEventListener('touchcancel', resume, { passive: true });

    ctl.current.nudge = (direction) => {
      const step = getCardStep();
      const snappedBase = Math.round(offset / step) * step;
      targetOffset = snappedBase + direction * step;
      isSnapping = true;
      isPaused = true;
    };

    const dotTimer = setInterval(() => setDotIdx((i) => (i + 1) % CARD_COUNT), 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(dotTimer);
      clearTimeout(touchTimer);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', onTouchEnd);
      track.removeEventListener('touchcancel', resume);
    };
  }, []);

  return (
    <>
      <div className="carousel-wrapper">
        <button
          className="carousel-arrow carousel-arrow-prev"
          aria-label="Previous"
          onClick={() => { ctl.current.nudge(-1); setDotIdx((i) => (i - 1 + CARD_COUNT) % CARD_COUNT); }}
        >
          &#8249;
        </button>
        <div className="carousel-container">
          <div className="carousel-track" ref={trackRef}>
            {CARDS.map((c, i) => (
              <div className="carousel-card" key={i}>
                <div className="card-image">
                  <img src={`/assets/images/${c.img}`} alt={c.alt} />
                </div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="carousel-arrow carousel-arrow-next"
          aria-label="Next"
          onClick={() => { ctl.current.nudge(1); setDotIdx((i) => (i + 1) % CARD_COUNT); }}
        >
          &#8250;
        </button>
      </div>

      <div className="carousel-dots">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <span key={i} className={'dot' + (i === dotIdx ? ' active' : '')} onClick={() => setDotIdx(i)}></span>
        ))}
      </div>
    </>
  );
}
