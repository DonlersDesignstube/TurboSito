(() => {
  const KEY = 'site-lang';
  const links = document.querySelectorAll('a[data-lang]');
  const cur = (document.documentElement.lang || '').slice(0,2).toLowerCase();

  // Markiere aktuelle Sprache
  links.forEach(a => {
    const isCur = a.dataset.lang === cur;
    a.setAttribute('aria-current', isCur ? 'true' : 'false');
  });

  // Klick = Wahl merken
  links.forEach(a => {
    a.addEventListener('click', () => {
      localStorage.setItem(KEY, a.dataset.lang);
    });
  });

  // Optional: wenn auf /index.html und KEINE Wahl gespeichert,
  // darf dein Autoredirect-Snippet weiterhin laufen (falls vorhanden).
})();
