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
  const l = langPrefix();           // "/de" | "/en" | "/it" | "/de"(default)
  return String(p)
    .replace(new RegExp(`^${b}`), '')
    .replace(/^\/(de|en|it)(?=\/)/, '')
    .replace(/\/{2,}/g,'/');
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
