export function basePath(){
  // optional per <meta name="base-path"> überschreibbar
  const m = document.querySelector('meta[name="base-path"]')?.content;
  if (m) return m.replace(/\/+$/,'');
  const seg = location.pathname.split('/').filter(Boolean);
  const isGh = /\.github\.io$/.test(location.hostname);
  return isGh && seg.length ? '/' + seg[0] : '';
}
export function langPrefix(){
  const p = location.pathname.replace(basePath(),'');
  const m = p.match(/^\/(de|en|it)\b/);
  return m ? '/' + m[1] : '';
}
export const withBase = p => (basePath() + '/' + String(p).replace(/^\/+/,'')).replace(/\/{2,}/g,'/');
export const asset    = p => withBase('/' + String(p).replace(/^\/+/,''));
export const partial  = f => withBase(langPrefix() + '/partials/' + f);
export const dataPath = f => asset('assets/data/' + f); // <— falls deine JSONs NICHT sprach-unterteilt sind

// Wenn deine Datasets sprachspezifisch sind (portfolio.de.json etc.):
// export const dataPath = f => asset('assets/data/' + f); so lassen und in Schritt 3 die richtige Datei wählen.
