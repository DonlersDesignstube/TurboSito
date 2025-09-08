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
// Partials sind sprachneutral unter /partials/*
export function partial(path){
  if (/^\.\.?(?:\/).*/.test(path)) return path; // relative bleibt relativ
  return withBase('/partials/' + path);
}

// Fallback, wenn jemand versehentlich eine sprachspezifische Partial-URL erwartet
export async function resolvePartialSafe(file){
  const url1 = partial(file);                         // /partials/header.html
  const url2 = withBase(langPrefix() + '/partials/' + file); // /de/partials/header.html (nur falls vorhanden)
  try{
    const r = await fetch(url1,{method:'HEAD'});
    if(r.ok) return url1;
  }catch{}
  return url2; // als Fallback probieren
}

export const dataPath = f => asset('assets/data/' + f); // <— falls deine JSONs NICHT sprach-unterteilt sind

// Wenn deine Datasets sprachspezifisch sind (portfolio.de.json etc.):
// export const dataPath = f => asset('assets/data/' + f); so lassen und in Schritt 3 die richtige Datei wählen.
