(() => {
  const KEY='site-lang';
  const els = document.querySelectorAll('a[data-lang]');
  els.forEach(a => {
    a.addEventListener('click', () => localStorage.setItem(KEY, a.dataset.lang));
    const cur = document.documentElement.lang?.slice(0,2).toLowerCase();
    if (cur && a.dataset.lang === cur) a.setAttribute('aria-current','true');
  });
})();
