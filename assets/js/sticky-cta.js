(() => {
  const THRESHOLD = 140; // erst ab diesem Scrollwert anzeigen
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // Sticky-Leiste einfügen (falls nicht vorhanden)
  let bar = document.querySelector('.sticky-cta');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'sticky-cta';
    bar.innerHTML = `<a class="btn" href="#quick-start" data-open-form aria-label="Projekt starten">Projekt starten</a>`;
    document.body.appendChild(bar);
  }
  const show = () => bar.classList.add('is-visible');
  const hide = () => bar.classList.remove('is-visible');

  // Formular-Karte (für IO-Hide)
  const card = document.querySelector('#quick-start')?.closest('.hero-card') || document.querySelector('#quick-start');
  // Mobile-Menü (für Hide bei offenem Menü)
  const menu = document.getElementById('mobile-menu');

  let formInView = false;
  if ('IntersectionObserver' in window && card) {
    const io = new IntersectionObserver((entries) => {
      formInView = entries.some(e => e.isIntersecting);
      tick(); // Sichtbarkeit neu bewerten
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.01 });
    io.observe(card);
  }

  const menuOpen = () => menu?.classList.contains('open');

  // Eingabefokus (Keyboard) => Sticky ausblenden
  const isField = el => el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName);
  document.addEventListener('focusin', e => {
    if (isField(e.target)) hide();
  });
  document.addEventListener('focusout', () => tick());

  // Hauptlogik: nur mobil, nur nach Scroll, nicht bei offenem Menü, nicht wenn Formular im View
  const tick = () => {
    if (!isMobile()) return hide();
    if (menuOpen()) return hide();
    if (formInView) return hide();

    const scrolled = window.scrollY >= THRESHOLD;
    if (scrolled) show(); else hide();
  };

  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick, { passive: true });

  // Startzustand: versteckt, bis gescrollt wurde
  hide();
  tick();
})();
