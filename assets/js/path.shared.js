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
