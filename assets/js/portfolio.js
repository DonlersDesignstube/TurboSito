/**
 * @typedef {Object} PortfolioItem
 * @property {string} slug
 * @property {string} title
 * @property {string} type
 * @property {string[]} kpis
 * @property {number} impactScore
 * @property {number} timeToLaunchHours
 * @property {string} summary
 * @property {string} demoUrl
 * @property {string} caseUrl
 * @property {string[]} tags
 * @property {string[]} [highlights]
 */
/** @typedef {{items: PortfolioItem[]}} LocalizedDataset */

import { basePath, langPrefix, normalizeInternalHref } from './path.shared.js';

const lang = (langPrefix().slice(1) || 'de');

// ————— Labels (lokalisiert) —————
const labels = {
  en: { view:'View case study', demo:'Open demo', load:'Load more', none:'No projects', reset:'Reset filters',
        count: n => `${n} project${n===1?'':'s'} visible` },
  de: { view:'Case Study ansehen', demo:'Demo öffnen', load:'Mehr laden', none:'Keine Projekte', reset:'Filter zurücksetzen',
        count: n => `${n} Projekt${n===1?'':'e'} sichtbar` },
  it: { view:'Vedi case study', demo:'Apri demo', load:'Carica altro', none:'Nessun progetto', reset:'Reimposta filtri',
        count: n => n===1 ? '1 progetto visibile' : `${n} progetti visibili` }
};
const t = labels[lang] || labels.en;

// ————— State & Flags —————
const live = document.getElementById('live-status');
const state = { type:'all', sort:'new', visible:6, items:/** @type {PortfolioItem[]} */([]), search:'', missing:false };
const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ————— Helpers —————
const asset = (p) => {
  // Repo-aware, ohne Sprachpräfix (für /assets/**)
  const b = (basePath() || '').replace(/\/+$/,'');
  return `${b}/${String(p).replace(/^\/+/,'')}`.replace(/\/{2,}/g,'/');
};

function applyReducedMotion(){
  if (prefersReduced) document.documentElement.classList.add('reduced-motion');
}

function validateItem(item){
  const required = ['slug','title','type','kpis','impactScore','timeToLaunchHours','summary','demoUrl','caseUrl','tags'];
  return required.every(k => k in item);
}

function normalizeState(){
  const validTypes = ['all','landing','corporate','shop','app'];
  const validSort  = ['new','impact','speed'];
  if (!validTypes.includes(state.type)) state.type = 'all';
  if (!validSort.includes(state.sort))  state.sort  = 'new';
}

function updateControls(){
  document.querySelectorAll('[data-type]').forEach(btn=>{
    const active = btn.getAttribute('data-type') === state.type;
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;
  });
  const btn = document.getElementById('sort-button');
  if (btn) {
    const current = document.querySelector(`#sort-menu [data-sort="${state.sort}"]`);
    if (current) btn.textContent = current.textContent || btn.textContent;
    document.querySelectorAll('#sort-menu [data-sort]').forEach(opt=>{
      const sel = opt.getAttribute('data-sort') === state.sort;
      opt.setAttribute('aria-selected', String(sel));
    });
  }
}

function hydrateFromURL(){
  const params = new URLSearchParams(location.search);
  state.type    = params.get('type') || 'all';
  state.sort    = params.get('sort') || 'new';
  state.missing = params.get('missing') === '1';
  normalizeState();
  updateControls();
  if (state.missing && live) live.textContent = 'Case nicht gefunden';
}

function applyFilters(items){
  let res = state.type !== 'all' ? items.filter(i => i.type === state.type) : items;
  if (state.search) {
    const q = state.search.toLowerCase();
    res = res.filter(i => (i.title + i.summary + i.tags.join(' ')).toLowerCase().includes(q));
  }
  return applySort(res);
}

function applySort(items){
  const arr = [...items];
  if (state.sort === 'impact') arr.sort((a,b) => (b.impactScore||0) - (a.impactScore||0));
  else if (state.sort === 'speed') arr.sort((a,b) => (a.timeToLaunchHours||9e9) - (b.timeToLaunchHours||9e9));
  else /* 'new' */ arr.sort((a,b) => (b.order||0) - (a.order||0)); // Fallback: order desc
  return arr;
}

function announceCount(count){
  if (live) live.textContent = t.count(count);
}

function renderSkeletons(n){
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  container.innerHTML = '';
  for (let i=0;i<n;i++){
    const article = document.createElement('article');
    article.className = 'case-card border p-4 rounded skeleton dark:border-gray-700';
    container.appendChild(article);
  }
}

function kpiRow(it){
  const a = Array.isArray(it.kpis) ? it.kpis : [];
  const lcp = a.find(v => /LCP/i.test(v)) || '≤1.1s LCP';
  const sig = a.find(v => /(CTA|Wirkung|Checkout)/i.test(v)) || 'Klare CTAs';
  const time = Number.isFinite(it.timeToLaunchHours) ? it.timeToLaunchHours : 48;
  return `
    <div class="text-sm opacity-80 flex items-center gap-3 mt-1">
      <span>⏱ ${time}h</span>
      <span>⚡ ${lcp}</span>
      <span>✅ ${sig}</span>
    </div>`;
}

function card(item){
  const caseUrl = item.caseUrl?.startsWith('http')
    ? item.caseUrl
    : normalizeInternalHref(item.caseUrl || `portfolio/${item.slug}.html`);
  const demoUrl = item.demoUrl?.startsWith('http')
    ? item.demoUrl
    : normalizeInternalHref(item.demoUrl || `portfolio/${item.slug}.html`);
  const tags = (item.tags||[]).slice(0,3).map(tg => `<li class="tag-pill">${tg}</li>`).join('');

  return `
    <article class="case-card border p-4 rounded focus-within:ring outline-none hover-lift bg-white dark:bg-gray-800 dark:border-gray-700" role="listitem" aria-label="${item.title}">
      <div class="ph-media mb-3 rounded" role="img" aria-label="Placeholder"></div>
      <span class="badge mb-2">Demo</span>
      <h3 class="font-semibold mb-1">${item.title}</h3>
      <ul class="flex flex-wrap gap-1 text-sm mb-2">${tags}</ul>
      <p class="kpi-row text-sm mb-3 flex flex-wrap gap-3">
        <span class="flex items-center gap-1"><span aria-hidden="true">⏱</span>${(item.kpis?.[0]||'48h')}</span>
        <span class="flex items-center gap-1"><span aria-hidden="true">⚡</span>${(item.kpis?.[1]||'≤1.1s LCP')}</span>
        <span class="flex items-center gap-1"><span aria-hidden="true">✅</span>${(item.kpis?.[2]||'Klare CTAs')}</span>
      </p>
      <div class="flex flex-wrap gap-3">
        <a class="btn btn-primary" data-cta="case" data-slug="${item.slug}" aria-label="${t.view}: ${item.title}" href="${caseUrl}">${t.view}</a>
        <a class="link" data-cta="demo" data-slug="${item.slug}" aria-label="${t.demo}: ${item.title}" href="${demoUrl}" target="_blank" rel="noopener">${t.demo}</a>
      </div>
    </article>`;
}

function render(){
  const container = document.getElementById('portfolio-grid');
  const empty     = document.getElementById('empty-state');
  const more      = document.getElementById('load-more');
  if (!container || !empty) return;

  const items = applyFilters(state.items);
  const visibleItems = items.slice(0, state.visible);

  if (items.length === 0) {
    container.innerHTML = '';
    empty.hidden = false;
    if (more) more.hidden = true;
    announceCount(0);
    return;
  }

  empty.hidden = true;
  container.innerHTML = visibleItems.map(card).join('');

  if (more) {
    more.hidden = items.length <= state.visible;
    more.textContent = t.load;
  }
  announceCount(visibleItems.length);
}

function updateURL(){
  const url = new URL(location.href);
  if (state.type !== 'all') url.searchParams.set('type', state.type); else url.searchParams.delete('type');
  if (state.sort !== 'new') url.searchParams.set('sort', state.sort); else url.searchParams.delete('sort');
  history.replaceState(null, '', url);
}

function initTabs(){
  /** @type {HTMLElement[]} */
  const tabs = Array.from(document.querySelectorAll('[data-type]'));
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      state.type = tab.getAttribute('data-type') || 'all';
      normalizeState();
      updateURL();
      state.visible = 6;
      updateControls();
      render();
    });
    tab.addEventListener('keydown', e=>{
      const idx = tabs.indexOf(document.activeElement);
      if (e.key === 'ArrowRight'){ e.preventDefault(); tabs[(idx+1)%tabs.length]?.focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx-1+tabs.length)%tabs.length]?.focus(); }
      if (e.key === 'Home')      { e.preventDefault(); tabs[0]?.focus(); }
      if (e.key === 'End')       { e.preventDefault(); tabs[tabs.length-1]?.focus(); }
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); tab.click(); }
    });
  });
}

function initSort(){
  const button = document.getElementById('sort-button');
  const menu   = document.getElementById('sort-menu');
  if (!button || !menu) return;

  const options = Array.from(menu.querySelectorAll('[data-sort]'));
  const close = ()=>{
    menu.classList.add('hidden');
    button.setAttribute('aria-expanded','false');
    button.focus();
  };

  button.addEventListener('click', ()=>{
    const open = button.getAttribute('aria-expanded') === 'true';
    if (open) return close();
    menu.classList.remove('hidden');
    button.setAttribute('aria-expanded','true');
    options[0]?.focus();
  });

  button.addEventListener('keydown', e=>{
    if (e.key === 'ArrowDown'){
      e.preventDefault();
      menu.classList.remove('hidden');
      button.setAttribute('aria-expanded','true');
      options[0]?.focus();
    }
  });

  menu.addEventListener('keydown', e=>{
    const idx = options.indexOf(document.activeElement);
    if (e.key === 'ArrowDown'){ e.preventDefault(); options[(idx+1)%options.length]?.focus(); }
    if (e.key === 'ArrowUp')  { e.preventDefault(); options[(idx-1+options.length)%options.length]?.focus(); }
    if (e.key === 'Home')     { e.preventDefault(); options[0]?.focus(); }
    if (e.key === 'End')      { e.preventDefault(); options[options.length-1]?.focus(); }
    if (e.key === 'Escape')   { e.preventDefault(); close(); }
    if (e.key === 'Tab')      { e.preventDefault(); } // focus im Menu halten
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      const sel = /** @type {HTMLElement} */(document.activeElement)?.getAttribute('data-sort');
      if (sel){
        state.sort = sel;
        close();
        updateURL();
        updateControls();
        render();
      }
    }
  });
}

function initLoadMore(){
  const more = document.getElementById('load-more');
  if (!more) return;

  more.addEventListener('click', ()=>{ state.visible += 3; render(); });

  if (!prefersReduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if (e.isIntersecting){
          state.visible += 3;
          render();
        }
      });
    });
    io.observe(more);
  }
}

async function loadData(language){
  try{
    const file = `assets/data/portfolio.${language}.json`; // Assets immer repo-aware, ohne Sprache davor
    const res  = await fetch(asset(file), { cache:'force-cache', credentials:'same-origin' });
    if (!res.ok) throw new Error(`dataset ${res.status}`);
    const json = /** @type {LocalizedDataset} */(await res.json());
    state.items = (json.items || []).filter(validateItem);
    announceCount(applyFilters(state.items).length);
    render();
  }catch(e){
    // Fehler-UI
    const container = document.getElementById('portfolio-grid');
    if (container){
      container.innerHTML = `<div class="p-4 border rounded text-center">${t.none}. <button id="retry" class="btn btn-primary mt-2">Retry</button></div>`;
      document.getElementById('retry')?.addEventListener('click', ()=>{
        renderSkeletons(state.visible);
        loadData(lang);
      });
    }
    console.warn('[portfolio] dataset failed', e);
  }
}

// ————— Bootstrap —————
let _booted = false;
export function init(){
  if (_booted) return;
  _booted = true;

  const list = document.getElementById('portfolio-grid');
  if (list) list.setAttribute('aria-busy','true');

  // nach jedem Render aria-busy entfernen
  const _render = render;
  render = (...a) => { const v = _render(...a); Promise.resolve().then(()=>{ if (list) list.setAttribute('aria-busy','false'); }); return v; };

  applyReducedMotion();
  renderSkeletons(state.visible);
  hydrateFromURL();
  initTabs();
  initSort();
  initLoadMore();
  const reset = document.getElementById('reset-filters');
  if (reset) reset.addEventListener('click', ()=>{
    state.type='all'; state.sort='new'; state.visible=6;
    updateURL(); updateControls(); render();
  });

  loadData(lang);
}
