(() => {
  const tick=()=>document.body.classList.toggle('is-scrolled', window.scrollY>2);
  window.addEventListener('scroll', tick, {passive:true});
  tick();
})();
