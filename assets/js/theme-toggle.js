(()=> {
  const lsKey = "site-theme";
  const apply = v => document.documentElement.setAttribute("data-theme", v);
  const saved = localStorage.getItem(lsKey);
  if (saved) apply(saved);
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  btn.setAttribute("aria-pressed", current==="light" ? "true":"false");
  btn.addEventListener("click", () => {
    const now = document.documentElement.getAttribute("data-theme")==="light" ? "dark" : "light";
    apply(now); localStorage.setItem(lsKey, now);
    btn.setAttribute("aria-pressed", now==="light" ? "true":"false");
  });
})();
