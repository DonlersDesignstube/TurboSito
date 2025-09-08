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
(function(){
  const lang = document.documentElement.lang || 'en';
  const labels = {
    en: {view:'View case study', demo:'Open demo', load:'Load more', none:'No projects', reset:'Reset filters'},
    de: {view:'Case Study ansehen', demo:'Demo öffnen', load:'Mehr laden', none:'Keine Projekte', reset:'Filter zurücksetzen'},
    it: {view:'Vedi case study', demo:'Apri demo', load:'Carica altro', none:'Nessun progetto', reset:'Reimposta filtri'}
  };
  const t = labels[lang] || labels.en;
  const live = document.getElementById('live-status');
  const state = {type:'all', sort:'new', visible:6, items:[], search:'', missing:false};
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyReducedMotion(){
    if(prefersReduced) document.documentElement.classList.add('reduced-motion');
  }

  function validateItem(item){
    const required=['slug','title','type','kpis','impactScore','timeToLaunchHours','summary','demoUrl','caseUrl','tags'];
    return required.every(k=>k in item);
  }

  async function loadData(language){
    try{
      const res = await fetch(`/TurboSito/assets/data/portfolio.${language}.json`,{cache:'force-cache'});
      const json = /** @type {LocalizedDataset} */(await res.json());
      state.items = json.items.filter(validateItem);
      announceCount(applyFilters(state.items).length);
      render();
    }catch(e){
      showError();
    }
  }

  function showError(){
    const container=document.getElementById('portfolio-grid');
    container.innerHTML=`<div class="p-4 border rounded text-center">${t.none}. <button id="retry" class="btn btn-primary mt-2">Retry</button></div>`;
    document.getElementById('retry').addEventListener('click',()=>{renderSkeletons(state.visible);loadData(lang);});
  }

  function normalizeState(){
    const validTypes=['all','landing','corporate','shop','app'];
    const validSort=['new','impact','speed'];
    if(!validTypes.includes(state.type)) state.type='all';
    if(!validSort.includes(state.sort)) state.sort='new';
  }

  function hydrateFromURL(){
    const params=new URLSearchParams(location.search);
    state.type=params.get('type')||'all';
    state.sort=params.get('sort')||'new';
    state.missing=params.get('missing')==='1';
    normalizeState();
    updateControls();
    if(state.missing && live) live.textContent='Case nicht gefunden';
  }

  function updateControls(){
    document.querySelectorAll('[data-type]').forEach(btn=>{
      const active=btn.getAttribute('data-type')===state.type;
      btn.setAttribute('aria-selected', active);
      btn.tabIndex=active?0:-1;
    });
    const btn=document.getElementById('sort-button');
    if(btn){
      const current=document.querySelector(`#sort-menu [data-sort="${state.sort}"]`);
      if(current) btn.textContent=current.textContent;
      document.querySelectorAll('#sort-menu [data-sort]').forEach(opt=>{
        const sel=opt.getAttribute('data-sort')===state.sort;
        opt.setAttribute('aria-selected', sel);
      });
    }
  }

  function applyFilters(items){
    let res = state.type!=='all'? items.filter(i=>i.type===state.type):items;
    if(state.search){
      const q=state.search.toLowerCase();
      res=res.filter(i=>(i.title+i.summary+i.tags.join('')).toLowerCase().includes(q));
    }
    return applySort(res);
  }

  function applySort(items){
    const arr=[...items];
    if(state.sort==='impact') arr.sort((a,b)=>b.impactScore-a.impactScore);
    else if(state.sort==='speed') arr.sort((a,b)=>a.timeToLaunchHours-b.timeToLaunchHours);
    return arr;
  }

  function announceCount(count){
    if(live) live.textContent=`${count} ${count===1?'project':'projects'} visible`;
  }

  function renderSkeletons(n){
    const container=document.getElementById('portfolio-grid');
    container.innerHTML='';
    for(let i=0;i<n;i++){
      const article=document.createElement('article');
      article.className='case-card border p-4 rounded skeleton dark:border-gray-700';
      container.appendChild(article);
    }
  }

  function render(){
    const container=document.getElementById('portfolio-grid');
    const empty=document.getElementById('empty-state');
    const items=applyFilters(state.items);
    const visibleItems=items.slice(0,state.visible);
    container.innerHTML='';
    if(items.length===0){
      empty.hidden=false;
      announceCount(0);
      return;
    }
    empty.hidden=true;
    visibleItems.forEach(item=>{
      const article=document.createElement('article');
      article.className='case-card border p-4 rounded focus-within:ring outline-none hover-lift bg-white dark:bg-gray-800 dark:border-gray-700';
      article.setAttribute('role','listitem');
      article.setAttribute('aria-label',item.title);
      article.innerHTML=`
        <div class="ph-media mb-3 rounded" role="img" aria-label="Placeholder"></div>
        <span class="badge mb-2">Demo</span>
        <h3 class="font-semibold mb-1">${item.title}</h3>
        <ul class="flex flex-wrap gap-1 text-sm mb-2">${item.tags.slice(0,3).map(t=>`<li class="tag-pill">${t}</li>`).join('')}</ul>
        <p class="kpi-row text-sm mb-3 flex flex-wrap gap-3">
          <span class="flex items-center gap-1"><span aria-hidden="true">⏱</span>${item.kpis[0]}</span>
          <span class="flex items-center gap-1"><span aria-hidden="true">⚡</span>${item.kpis[1]}</span>
          <span class="flex items-center gap-1"><span aria-hidden="true">✅</span>${item.kpis[2]}</span>
        </p>
        <div class="flex flex-wrap gap-3">
          <a class="btn btn-primary" aria-label="${t.view}: ${item.title}" href="${item.caseUrl}">${t.view}</a>
          <a class="link" aria-label="${t.demo}: ${item.title}" href="${item.demoUrl}" target="_blank" rel="noopener">${t.demo}</a>
        </div>`;
      container.appendChild(article);
    });
    const more=document.getElementById('load-more');
    more.hidden=items.length<=state.visible;
    more.textContent=t.load;
    announceCount(visibleItems.length);
  }

  function updateURL(){
    const url=new URL(location.href);
    if(state.type!=='all') url.searchParams.set('type',state.type); else url.searchParams.delete('type');
    if(state.sort!=='new') url.searchParams.set('sort',state.sort); else url.searchParams.delete('sort');
    history.replaceState(null,'',url);
  }

  function initTabs(){
    const tabs=Array.from(document.querySelectorAll('[data-type]'));
    tabs.forEach(tab=>{
      tab.addEventListener('click',()=>{
        state.type=tab.getAttribute('data-type');
        normalizeState();
        updateURL();
        state.visible=6;
        updateControls();
        render();
      });
      tab.addEventListener('keydown',e=>{
        const idx=tabs.indexOf(document.activeElement);
        if(e.key==='ArrowRight'){e.preventDefault();tabs[(idx+1)%tabs.length].focus();}
        if(e.key==='ArrowLeft'){e.preventDefault();tabs[(idx-1+tabs.length)%tabs.length].focus();}
        if(e.key==='Home'){e.preventDefault();tabs[0].focus();}
        if(e.key==='End'){e.preventDefault();tabs[tabs.length-1].focus();}
        if(e.key==='Enter'||e.key===' '){e.preventDefault();tab.click();}
      });
    });
  }

  function initSort(){
    const button=document.getElementById('sort-button');
    const menu=document.getElementById('sort-menu');
    const options=Array.from(menu.querySelectorAll('[data-sort]'));
    function close(){
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded','false');
      button.focus();
    }
    button.addEventListener('click',()=>{
      const open=button.getAttribute('aria-expanded')==='true';
      if(open){close();return;}
      menu.classList.remove('hidden');
      button.setAttribute('aria-expanded','true');
      options[0].focus();
    });
    button.addEventListener('keydown',e=>{
      if(e.key==='ArrowDown'){e.preventDefault();menu.classList.remove('hidden');button.setAttribute('aria-expanded','true');options[0].focus();}
    });
    menu.addEventListener('keydown',e=>{
      const idx=options.indexOf(document.activeElement);
      if(e.key==='ArrowDown'){e.preventDefault();options[(idx+1)%options.length].focus();}
      if(e.key==='ArrowUp'){e.preventDefault();options[(idx-1+options.length)%options.length].focus();}
      if(e.key==='Home'){e.preventDefault();options[0].focus();}
      if(e.key==='End'){e.preventDefault();options[options.length-1].focus();}
      if(e.key==='Escape'){e.preventDefault();close();}
      if(e.key==='Tab'){e.preventDefault();}
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        state.sort=document.activeElement.getAttribute('data-sort');
        close();
        updateURL();
        updateControls();
        render();
      }
    });
  }

  function initLoadMore(){
    const more=document.getElementById('load-more');
    more.addEventListener('click',()=>{state.visible+=3;render();});
    if(!prefersReduced){
      const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){state.visible+=3;render();}})});
      io.observe(more);
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    applyReducedMotion();
    renderSkeletons(state.visible);
    loadData(lang);
    hydrateFromURL();
    initTabs();
    initSort();
    initLoadMore();
    const reset=document.getElementById('reset-filters');
    if(reset) reset.addEventListener('click',()=>{state.type='all';state.sort='new';updateURL();updateControls();render();});
  });
})();
