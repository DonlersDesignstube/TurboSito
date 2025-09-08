(() => {
  const KEY = 'site-theme';
  const root = document.documentElement;
  let initialized = false;

  function apply(mode) {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(KEY, mode);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
  }

  function toggle(e) {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
  }

  function initThemeToggle() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem(KEY);
    const current = root.getAttribute('data-theme') || saved || (prefersDark ? 'dark' : 'light');
    apply(current);
    if (!initialized) {
      document.addEventListener('click', toggle);
      initialized = true;
    }
  }

  window.initThemeToggle = initThemeToggle;

  if (document.readyState !== 'loading') initThemeToggle();
  else document.addEventListener('DOMContentLoaded', initThemeToggle);
})();
