(() => {
  const card = document.querySelector('.hero-card');
  if (!card) return;

  const makeToggle = () => {
    if (window.innerWidth > 768) { card.classList.remove('is-collapsed'); toggle?.remove?.(); return; }
    // schon vorhanden?
    let t = document.querySelector('.hero-toggle');
    if (!t) {
      t = document.createElement('div');
      t.className = 'hero-toggle';
      t.innerHTML = `<a class="btn" href="#quick-start" data-open-form>Projekt starten</a>`;
      // nach den linken CTAs einfügen:
      const cta = document.querySelector('.cta-hero');
      (cta?.parentElement || document.querySelector('main')).insertBefore(t, (cta?.nextSibling || null));
    }
    card.classList.add('is-collapsed');
  };

  const openForm = () => { card.classList.remove('is-collapsed'); setTimeout(() => card.scrollIntoView({behavior:'smooth', block:'start'}), 50); };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open-form]');
    if (a) { e.preventDefault(); openForm(); history.replaceState(null,'', '#quick-start'); }
  });

  // Anker-Öffnung (z.B. Link „Kontakt aufnehmen“)
  if (location.hash === '#quick-start' && window.innerWidth <= 768) {
    setTimeout(openForm, 60);
  }

  window.addEventListener('resize', makeToggle, {passive:true});
  makeToggle();
})();
