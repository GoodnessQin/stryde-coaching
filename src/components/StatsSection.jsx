import { useEffect, useRef, useState } from 'react';

const STATS = [
  { target: 50, suffix: '+', text: 'Professionals successfully coached and mentored' },
  { target: 150, suffix: '+', text: 'Careers elevated with CVs that deliver results' },
  { target: 98, suffix: '%', text: 'Success rate in turning applications into interview opportunities' },
];

/** Stats section + port of "7. STATS COUNTER" */
export default function StatsSection() {
  const ref = useRef(null);
  const [values, setValues] = useState(STATS.map(() => null)); // null renders "0"

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const timers = [];
    let done = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          STATS.forEach((s, idx) => {
            let current = 0;
            const inc = s.target / 60;
            const t = setInterval(() => {
              current += inc;
              const next = current >= s.target ? s.target : Math.floor(current);
              if (current >= s.target) clearInterval(t);
              setValues((v) => {
                const copy = [...v];
                copy[idx] = next;
                return copy;
              });
            }, 30);
            timers.push(t);
          });
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      timers.forEach(clearInterval);
    };
  }, []);

  return (
    <section className="stats-section section-animate" ref={ref}>
      <div className="container fade-in">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-card" key={i}>
              <h3>{values[i] === null ? '0' : values[i] + s.suffix}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
