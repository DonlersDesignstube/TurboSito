(function(){
  const lang = document.documentElement.lang || 'en';
  const labels = {
    en: {view:'View case study', demo:'Open demo', load:'Load more'},
    de: {view:'Case Study ansehen', demo:'Demo öffnen', load:'Mehr laden'},
    it: {view:'Vedi case study', demo:'Apri demo', load:'Carica altro'}
  };
  const t = labels[lang] || labels.en;
  const state = {type:'all', sort:'new', visible:2, items:[]};

  async function loadData(language){
    const res = await fetch(`/TurboSito/assets/data/portfolio.${language}.json`);
    const json = await res.json();
    return json.items;
  }

  function applyFilters(items){
    let filtered = state.type && state.type !== 'all' ? items.filter(i=>i.type===state.type) : items;
    return applySort(filtered);
  }

  function applySort(items){
    const arr = [...items];
    if(state.sort==='impact') arr.sort((a,b)=>b.impactScore - a.impactScore);
    else if(state.sort==='speed') arr.sort((a,b)=>a.timeToLaunchHours - b.timeToLaunchHours);
    return arr; // 'new' keeps original order
  }

  function render(){
    const container = document.getElementById('portfolio-grid');
    container.innerHTML='';
    const items = applyFilters(state.items).slice(0,state.visible);
    items.forEach(item=>{
      const article = document.createElement('article');
      article.className = 'case-card border p-4 rounded focus-within:ring outline-none';
      article.setAttribute('role','listitem');
      article.setAttribute('aria-label', item.title);
      article.innerHTML = `
        <div class="ph-media mb-3" role="img" aria-label="Placeholder"></div>
        <span class="badge mb-2">Demo</span>
        <h3 class="font-semibold mb-1">${item.title}</h3>
        <ul class="flex flex-wrap gap-1 text-sm mb-2">
          ${item.tags.slice(0,3).map(t=>`<li class="tag">${t}</li>`).join('')}
        </ul>
        <p class="text-sm mb-3">⏱ ${item.kpis[0]} • ⚡ ${item.kpis[1]} • ✅ ${item.kpis[2]}</p>
        <div class="flex flex-wrap gap-3">
          <a class="btn btn-primary" aria-label="${t.view}: ${item.title}" href="${item.caseUrl}">${t.view}</a>
          <a class="link" aria-label="${t.demo}: ${item.title}" href="${item.demoUrl}" target="_blank" rel="noopener">${t.demo}</a>
        </div>`;
      container.appendChild(article);
    });
    const more = document.getElementById('load-more');
    more.hidden = applyFilters(state.items).length <= state.visible;
    more.textContent = t.load;
  }

  function hydrateFromURL(){
    const params = new URLSearchParams(location.search);
    if(params.get('type')) state.type = params.get('type');
    if(params.get('sort')) state.sort = params.get('sort');
    document.querySelectorAll('[data-type]').forEach(btn=>{
      const active = btn.getAttribute('data-type') === state.type;
      btn.setAttribute('aria-pressed', active);
    });
    const sortSel = document.getElementById('sort');
    if(sortSel) sortSel.value = state.sort;
  }

  function updateURL(){
    const url = new URL(location);
    if(state.type && state.type !== 'all') url.searchParams.set('type', state.type); else url.searchParams.delete('type');
    if(state.sort && state.sort !== 'new') url.searchParams.set('sort', state.sort); else url.searchParams.delete('sort');
    history.replaceState(null,'',url);
  }

  function initA11yTabs(){
    document.querySelectorAll('[data-type]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        state.type = btn.getAttribute('data-type');
        document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed', b===btn));
        updateURL();
        state.visible = 2;
        render();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async()=>{
    state.items = await loadData(lang);
    hydrateFromURL();
    initA11yTabs();
    const sortSel = document.getElementById('sort');
    if(sortSel) sortSel.addEventListener('change', e=>{
      state.sort = e.target.value;
      updateURL();
      render();
    });
    const more = document.getElementById('load-more');
    if(more) more.addEventListener('click', ()=>{state.visible+=2; render();});
    render();
  });
})();
