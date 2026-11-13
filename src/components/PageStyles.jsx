import { useLayoutEffect } from 'react';
import enhanced from '../styles/legacy/enhanced-main.css?raw';
import styles from '../styles/legacy/styles.css?raw';
import mobile from '../styles/legacy/mobile-responsive.css?raw';
import contact from '../styles/legacy/contact.css?raw';
import testimonials from '../styles/legacy/testmonials.css?raw';
import service from '../styles/legacy/service.css?raw';
import about from '../styles/legacy/about.css?raw';
import refer from '../styles/refer.css?raw';
import navAddon from '../styles/nav-addon.css?raw';

/*
 * The original site loaded a different set of stylesheets, in a different
 * order, on each page. Several pages define the same selectors (.hero-subtitle,
 * .btn-primary, ...), so bundling all CSS globally would change how pages look.
 *
 * To keep the UI pixel-identical, the original CSS files are kept verbatim and
 * injected per route, in exactly the order each HTML page used.
 */
const SHEETS = { enhanced, styles, mobile, contact, testimonials, service, about, refer, navAddon };

export const PAGE_CSS = {
  home: ['enhanced', 'mobile', 'styles', 'navAddon'],
  about: ['enhanced', 'mobile', 'styles', 'about', 'navAddon'],
  services: ['enhanced', 'styles', 'mobile', 'service', 'navAddon'],
  testimonials: ['enhanced', 'styles', 'mobile', 'testimonials', 'navAddon'],
  contact: ['enhanced', 'styles', 'mobile', 'contact', 'navAddon'],
  refer: ['enhanced', 'styles', 'mobile', 'refer', 'navAddon'],
};

// Relative asset URLs in the CSS were written for /css/*.css; make them root-absolute.
const fixUrls = (css) => css.replace(/url\((['"]?)\.\.\/assets\//g, 'url($1/assets/');
const cache = {};
const getCss = (name) => (cache[name] ??= fixUrls(SHEETS[name]));

function inject(name, css) {
  const el = document.createElement('style');
  el.setAttribute('data-page-style', name);
  el.textContent = css;
  document.head.appendChild(el);
  return el;
}

export default function PageStyles({ page }) {
  useLayoutEffect(() => {
    const nodes = PAGE_CSS[page].map((name) => inject(name, getCss(name)));
    return () => nodes.forEach((n) => n.remove());
  }, [page]);
  return null;
}

/** Inject an arbitrary stylesheet string while mounted (used by the admin chunk). */
export function InjectStyles({ name, css }) {
  useLayoutEffect(() => {
    const el = inject(name, css);
    return () => el.remove();
  }, [name, css]);
  return null;
}
