(() => {
  const form = document.querySelector('#quick-start');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const q = new URLSearchParams(fd).toString();
    location.href = `/TurboSito/de/kontakt.html?${q}`;
  });
})();
