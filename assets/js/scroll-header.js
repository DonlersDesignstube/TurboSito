(() => {
  const on = () => document.body.classList.add('is-scrolled');
  const off = () => document.body.classList.remove('is-scrolled');
  const tick = () => (window.scrollY > 2 ? on() : off());
  window.addEventListener('scroll', tick, {passive:true}); tick();
})();
