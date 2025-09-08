export function basePath() {
  const meta = document.querySelector('meta[name="base-path"]')?.content;
  if (meta) return meta.replace(/\/+$/,'');
  const seg = location.pathname.split('/').filter(Boolean);
  const isGh = /\.github\.io$/.test(location.hostname);
  return isGh && seg.length ? '/' + seg[0] : '';
}
export function langPrefix() {
  const m = location.pathname.replace(basePath(), '').match(/^\/(de|en|it)\b/);
  return m ? '/' + m[1] : '/de'; // Default de
}
export const withBase = (p='') => (basePath() + '/' + String(p).replace(/^\/+/, '')).replace(/\/{2,}/g,'/');

export function stripBaseAndLang(p){
  const b = basePath();
  return String(p)
    .replace(new RegExp(`^${b}`), '')
    .replace(/^\/(de|en|it)(?=\/)/, '')
    .replace(/\/{2,}/g,'/');
}

export function ensureFile(path){
  return path.endsWith('/') ? (path + 'index.html') : path;
}

export function collapseRepeats(path){
  const b = basePath().replace(/^\//,'');            // "TurboSito"
  return path
    .replace(new RegExp(`/(?:${b}/)+`, 'g'), `/${b}/`)
    .replace(/\/(?:(de|en|it)\/)+/g, (m, g1) => `/${g1}/`)
    .replace(/\/{2,}/g,'/');
}

/**
 * Normiert *jede* interne URL:
 * - akzeptiert absolute, root-absolute und relative Eingaben
 * - erhält query/hash
 * - gibt root-absolute (oder absolute für canonical/alternate) zurück
 */
export function normalizeInternalHref(raw, { absoluteForHead=false } = {}){
  const u = new URL(raw, location.href);                 // relative → absolute
  if (u.origin !== location.origin) return raw;          // extern: nicht anfassen

  let p = stripBaseAndLang(u.pathname);
  p = ensureFile(p);
  const lang = langPrefix();                              // "/de" | "/en" | "/it"
  p = collapseRepeats(`${lang}/${p}`);                    // genau *eine* Sprache
  let finalPath = withBase(p);                            // Repo-Präfix genau *einmal*
  finalPath = collapseRepeats(finalPath);                 // doppelte Segmente abbauen

  const finalUrl = finalPath + u.search + u.hash;
  return absoluteForHead ? new URL(finalUrl, location.origin).toString() : finalUrl;
}

const ROUTES = {
  home: { de: '/', en: '/', it: '/' },
  about: { de: '/ueber-mich.html', en: '/about.html', it: '/chi-sono.html' },
  services: { de: '/leistungen.html', en: '/services.html', it: '/servizi.html' },
  portfolio: { de: '/portfolio.html', en: '/portfolio.html', it: '/portfolio.html' },
  contact: { de: '/kontakt.html', en: '/contact.html', it: '/contatti.html' }
};

export function resolveLocalized(route, lang = langPrefix().slice(1) || 'de'){
  const p = ROUTES[route]?.[lang];
  if(!p) return '';
  return withBase(`/${lang}${p}`.replace(/\/{2,}/g,'/'));
}
