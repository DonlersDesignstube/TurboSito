(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('section, article.card');
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => e.isIntersecting && e.target.classList.add('is-in'));
  }, { threshold: 0.08 });
  els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
})();
