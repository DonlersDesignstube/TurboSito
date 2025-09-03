(() => {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  // Sticky Element einfügen, falls nicht vorhanden
  let bar = document.querySelector('.sticky-cta');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'sticky-cta';
    bar.innerHTML = `<a class="btn" href="#quick-start" data-open-form aria-label="Projekt starten">Projekt starten</a>`;
    document.body.appendChild(bar);
  }

  const show = () => bar.classList.add('is-visible');
  const hide = () => bar.classList.remove('is-visible');

  // Ausblenden wenn Formular sichtbar
  const form = document.querySelector('#quick-start')?.closest('.hero-card') || document.querySelector('#quick-start');
  let io;
  if ('IntersectionObserver' in window && form) {
    io = new IntersectionObserver((entries) => {
      const inView = entries.some(e => e.isIntersecting);
      if (inView) hide(); else if (isMobile()) show();
    }, { rootMargin: '0px 0px -30% 0px', threshold: 0.01 });
    io.observe(form);
  }

  // Menü-offen? (Overlay/Panel vorhanden → class .open), dann CTA ausblenden
  const menu = document.getElementById('mobile-menu');
  const tickMenu = () => {
    const open = menu?.classList.contains('open');
    if (open) hide(); else if (isMobile()) show();
  };
  menu?.addEventListener('transitionend', tickMenu);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-nav-toggle],[data-nav-close]')) setTimeout(tickMenu, 50);
  });

  // Scroll-Heuristik: ab 160px einblenden (wenn nicht durch IO/menü versteckt)
  let lastY = window.scrollY;
  const onScroll = () => {
    if (!isMobile()) return hide();
    const y = window.scrollY;
    if (y > 160 && !menu?.classList.contains('open')) show(); else hide();
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); // initial
})();
