import { useEffect, useState } from 'react';

// Only shown on the very first page load of the session (like the original
// index.html loader), not on every client-side navigation back to Home.
let alreadyShown = false;

/** Port of "2. PAGE LOADER" */
export default function PageLoader() {
  const [state, setState] = useState(alreadyShown ? 'gone' : 'visible');

  useEffect(() => {
    if (state === 'gone') return undefined;
    alreadyShown = true;
    const timers = [];
    let done = false;
    const hide = () => {
      if (done) return;
      done = true;
      setState('hidden');
      timers.push(setTimeout(() => setState('gone'), 700));
    };
    const onLoad = () => timers.push(setTimeout(hide, 800));
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    timers.push(setTimeout(hide, 3000));
    return () => {
      window.removeEventListener('load', onLoad);
      timers.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === 'gone') return null;
  return (
    <div className={'page-loader' + (state === 'hidden' ? ' hidden' : '')}>
      <div className="loader-logo">
        <img src="/assets/icons/logo-loader.svg" alt="Stryde Coaching" style={{ height: 80 }} />
      </div>
      <p className="loader-text">Stryde Coaching</p>
    </div>
  );
}
