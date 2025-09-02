(()=> {
  const k="site-theme"; const apply=v=>document.documentElement.setAttribute("data-theme",v);
  const saved=localStorage.getItem(k); if(saved) apply(saved);
  const btn=document.getElementById("theme-toggle"); if(!btn) return;
  const sync=()=>btn.setAttribute("aria-pressed",(document.documentElement.getAttribute("data-theme")==="light")?"true":"false");
  sync();
  btn.addEventListener("click",()=>{const now=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light"; apply(now); localStorage.setItem(k,now); sync();});
})();
