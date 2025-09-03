(() => {
  const form = document.querySelector('#quick-start');
  if (!form) return;

  const $ = (s) => form.querySelector(s);
  const submitBtn = $('#qs-submit');
  const msg = $('#qs-msg');
  const email = $('#email');
  const name = $('#name');
  const ok = $('#ok');
  const hp = $('#company');
  const note = $('#note');
  const charHelp = $('#charHelp');

  // Live counter
  note?.addEventListener('input', () => {
    const left = 140 - (note.value?.length || 0);
    if (charHelp) charHelp.textContent = `Noch ${left} Zeichen`;
  });

  // Tracking fields
  const params = new URLSearchParams(location.search);
  $('#lang').value = (document.documentElement.lang || 'de').slice(0,2);
  $('#source').value = location.pathname;
  $('#theme').value = document.documentElement.getAttribute('data-theme') || 'dark';
  $('#utm').value = JSON.stringify({
    utm_source:  params.get('utm_source')  || '',
    utm_medium:  params.get('utm_medium')  || '',
    utm_campaign:params.get('utm_campaign')|| ''
  });

  // Simple email check
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';

    // Honeypot
    if (hp && hp.value) { msg.textContent = 'Fehler. Bitte direkt per Kontakt melden.'; return; }

    // Required checks
    if (!name.value.trim()) { name.focus(); msg.textContent = 'Bitte Namen angeben.'; return; }
    if (!isEmail(email.value)) { email.focus(); msg.textContent = 'Bitte gültige E-Mail angeben.'; return; }
    if (!ok.checked) { ok.focus(); msg.textContent = 'Bitte Datenschutzzustimmung setzen.'; return; }

    // Disable & redirect as GET
    submitBtn.disabled = true;
    const fd = new FormData(form);
    const q = new URLSearchParams(fd).toString();
    location.href = `/TurboSito/de/kontakt.html?${q}`;
  });
})();
