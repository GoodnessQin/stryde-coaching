/** Port of the marquee section + "5. MARQUEE" (content is duplicated for a seamless loop). */
export default function Marquee({ items, reverse = false }) {
  const content = (key) => (
    <div className="marquee-content" key={key} aria-hidden={key === 'clone' ? true : undefined}>
      {items.map((t, i) => <span key={i}>{t}</span>)}
    </div>
  );
  return (
    <div className={'marquee-section' + (reverse ? ' marquee-reverse' : '')}>
      <div className="marquee">
        {content('a')}
        {content('clone')}
      </div>
    </div>
  );
}
