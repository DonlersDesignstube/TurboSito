(()=> {
  const items = document.querySelectorAll('.faq [data-acc-btn]');
  items.forEach(btn => {
    const p = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const ex = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!ex));
      p.hidden = ex;
    });
  });
})();
