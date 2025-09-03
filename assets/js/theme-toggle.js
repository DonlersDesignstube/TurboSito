(() => {
  const KEY='site-theme';
  const root=document.documentElement;
  const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
  const saved=localStorage.getItem(KEY);
  const initial = saved || (prefersDark ? 'dark' : 'light');
  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(KEY, mode);
    const btn=document.querySelector('[data-theme-toggle]');
    if (btn) btn.setAttribute('aria-pressed', mode==='dark' ? 'true' : 'false');
  };
  apply(initial);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = (root.getAttribute('data-theme')==='dark') ? 'light' : 'dark';
    apply(next);
  });
})();
