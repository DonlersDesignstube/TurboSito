(() => {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // Sticky Element (falls fehlt) injizieren
  let bar = document.querySelector('.sticky-cta');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'sticky-cta';
    bar.innerHTML = `<a class="btn" href="#quick-start" data-open-form aria-label="Projekt starten">Projekt starten</a>`;
    document.body.appendChild(bar);
  }

  const show = () => bar.classList.add('is-visible');
  const hide = () => bar.classList.remove('is-visible');

  // Großes Formular / Karte im View? → ausblenden
  const form = document.querySelector('#quick-start')?.closest('.hero-card') || document.querySelector('#quick-start');
  let io;
  if ('IntersectionObserver' in window && form) {
    io = new IntersectionObserver((entries) => {
      const inView = entries.some(e => e.isIntersecting);
      if (inView) hide(); else if (isMobile()) show();
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.01 });
    io.observe(form);
  }

  // Mobile-Menü offen? → ausblenden
  const menu = document.getElementById('mobile-menu');
  const tickMenu = () => {
    const open = menu?.classList.contains('open');
    if (open) hide(); else if (isMobile()) show();
  };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-nav-toggle],[data-nav-close]')) setTimeout(tickMenu, 50);
  });

  // Eingabe-Fokus (Micro-Form + großes Formular) → ausblenden (Keyboard)
  const isFormField = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA');
  document.addEventListener('focusin', (e) => {
    if (isFormField(e.target) && (e.target.closest('#micro-start') || e.target.closest('#quick-start'))) hide();
  });
  document.addEventListener('focusout', () => {
    if (isMobile() && !menu?.classList.contains('open')) show();
  });

  // Scroll-Heuristik: ab 160px einblenden (wenn nichts anderes greift)
  const onScroll = () => {
    if (!isMobile()) return hide();
    if (!form) return show();
    if (window.scrollY > 160 && !menu?.classList.contains('open')) show();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); // init
})();
