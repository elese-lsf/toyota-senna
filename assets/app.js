
(function(){
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stamp=()=>'?t='+Math.floor(Date.now()/60000);
async function getJSON(url,fallback){
  try{const r=await fetch(url+stamp());if(!r.ok)throw 0;return await r.json();}catch(e){return fallback;}
}
const mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};

let site,minutas,entreg;

function viewInicio(item){
  const v=mk('div','view wrap');
  const last=minutas[0];
  const next=last&&last.proxima?last:null;
  let h='<h1>Dónde estamos y qué sigue</h1><p class="lead">Seguimiento del proyecto de comunicación y cobranza de planes de ahorro de Senna Automotores.</p><div class="rule"></div>';
  if(next){
    h+='<section><div class="next"><div><p class="k">Próxima reunión</p><p class="when-big">'+esc(next.proxima)+'</p></div><p class="t">'+esc(next.proxima_tema||'')+'</p><div><p class="k">Etapa</p><p class="t">'+esc(site.etapa||'')+'</p></div></div></section>';
  }
  const conItems=minutas.find(m=>m.items.length);
  if(conItems){
    h+='<section><div class="sec-head"><h2>Qué hay abierto</h2></div><p class="sec-note">Los compromisos de la última minuta con seguimiento, de cada parte.</p><div class="cols">';
    [['eLabs','Compromisos de The eLabs'],['Senna','Compromisos de Senna']].forEach(([k,label])=>{
      const open=conItems.items.filter(i=>i.parte===k&&i.estado!=='hecho');
      h+='<div class="col"><h3>'+label+'</h3><p class="cnt">'+open.length+' abiertos · minuta del '+esc(conItems.fechaTxt)+'</p>'+
        (open.length?'<ul>'+open.map(i=>'<li>'+esc(i.txt)+'<small>'+esc(i.resp)+' · '+esc(i.cuando)+'</small></li>').join('')+'</ul>':'<p class="none">Sin compromisos abiertos.</p>')+'</div>';
    });
    h+='</div></section>';
  }
  const others=site.nav.filter(n=>n.tipo!=='inicio');
  if(others.length){
    h+='<section><div class="links">'+others.map(n=>'<a class="link-card" href="#'+esc(n.id)+'"><h3>'+esc(n.label)+'</h3><p>'+esc(n.descripcion||'')+'</p></a>').join('')+'</div></section>';
  }
  v.innerHTML=h;return v;
}

function viewAvances(item){
  const v=mk('div','view wrap');
  let h='<h1>'+esc(item.label)+'</h1><p class="lead">Una entrada por reunión, la más reciente arriba. Cada una tiene su link propio para citarla desde el mail.</p><div class="rule"></div><section><div class="log">';
  if(!minutas.length) h+='<p class="empty-state">Todavía no hay minutas publicadas.</p>';
  minutas.forEach(m=>{
    let b='';
    if(m.resumen) b+='<p class="summary">'+esc(m.resumen)+'</p>';
    [['eLabs','The eLabs'],['Senna','Senna']].forEach(([k,label])=>{
      const rows=m.items.filter(i=>i.parte===k);
      if(!rows.length) return;
      b+='<div class="grp"><h4>'+label+'</h4><div class="tblwrap"><table class="tbl"><thead><tr><th>Compromiso</th><th>Responsable</th><th>Para cuándo</th><th>Estado</th></tr></thead><tbody>'+
        rows.map(i=>'<tr><td>'+esc(i.txt)+'</td><td class="who">'+esc(i.resp)+'</td><td class="due">'+esc(i.cuando)+'</td><td><span class="chip '+(i.estado==='hecho'?'met':'pend')+'">'+(i.estado==='hecho'?'Hecho':'Pendiente')+'</span></td></tr>').join('')+
        '</tbody></table></div></div>';
    });
    b+='<div class="entry-foot"><button class="act" type="button" data-copy="'+esc(m.id)+'">Copiar link a esta minuta</button>'+(m.pdf?'<a class="act" href="'+esc(m.pdf)+'" target="_blank" rel="noopener">Ver PDF</a>':'')+'</div>';
    h+='<article class="entry" id="'+esc(m.id)+'"><div class="entry-head"><h3>'+esc(m.titulo)+'</h3><span class="chip">'+esc(m.fechaTxt)+'</span></div><p class="src">'+esc(m.origen||'')+'</p>'+b+'</article>';
  });
  h+='</div></section>';
  v.innerHTML=h;
  v.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',()=>{
    const url=location.href.split('#')[0]+'#'+btn.dataset.copy;
    const done=()=>{const t=btn.textContent;btn.textContent='Link copiado';setTimeout(()=>btn.textContent=t,1800);};
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done,()=>{location.hash=btn.dataset.copy;});
    else location.hash=btn.dataset.copy;
  }));
  return v;
}

function viewEntregables(item){
  const v=mk('div','view wrap');
  let h='<h1>'+esc(item.label)+'</h1><p class="lead">Qué se entrega en el proyecto y dónde está cada cosa.</p><div class="rule"></div>';
  if(entreg.url&&entreg.acceso_cliente){
    h+='<section><div class="drive"><p>'+esc(entreg.nota||'Carpeta compartida del proyecto.')+'</p><a class="act primary" href="'+esc(entreg.url)+'" target="_blank" rel="noopener">Abrir la carpeta</a></div></section>';
  } else if(entreg.nota){
    h+='<section><div class="note">'+esc(entreg.nota)+'</div></section>';
  }
  h+='<section><div class="sec-head"><h2>Qué contiene</h2></div><div class="folders" style="margin-top:14px">'+
    (entreg.items||[]).map(i=>'<div class="folder"><h3>'+esc(i.nombre)+'</h3><p>'+esc(i.descripcion||'')+'</p>'+(i.estado?'<span class="chip '+(/disponible|entregado|hecho/i.test(i.estado)?'met':'pend')+'">'+esc(i.estado)+'</span>':'')+'</div>').join('')+
    '</div></section>';
  v.innerHTML=h;return v;
}

function viewPagina(item){
  const v=mk('div','view frame');
  const f=document.createElement('iframe');
  f.title=item.label;f.setAttribute('scrolling','no');
  f.style.cssText='width:100%;border:0;display:block;min-height:60vh';
  f.addEventListener('load',()=>{
    const fit=()=>{try{f.style.height=f.contentDocument.documentElement.scrollHeight+'px';}catch(e){}};
    fit();
    try{new ResizeObserver(fit).observe(f.contentDocument.body);}catch(e){}
  });
  v.appendChild(f);
  v._load=()=>{if(!f.getAttribute('src')) f.setAttribute('src',item.src);};
  return v;
}

const BUILDERS={inicio:viewInicio,avances:viewAvances,entregables:viewEntregables,pagina:viewPagina};
const views={};

function show(){
  const h=decodeURIComponent(location.hash.slice(1));
  let target=site.nav.find(n=>n.id===h);
  let anchor=null;
  if(!target&&h.indexOf('minuta-')===0){target=site.nav.find(n=>n.tipo==='avances');anchor=h;}
  if(!target) target=site.nav[0];
  site.nav.forEach(n=>{
    const on=n===target;
    views[n.id].hidden=!on;
    const a=document.querySelector('#nav a[data-v="'+n.id+'"]');
    if(on) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
  if(views[target.id]._load) views[target.id]._load();
  document.querySelectorAll('.entry.focus').forEach(e=>e.classList.remove('focus'));
  const el=anchor&&document.getElementById(anchor);
  if(el){el.classList.add('focus');el.scrollIntoView();} else window.scrollTo(0,0);
}

async function init(){
  [site,minutas,entreg]=await Promise.all([
    getJSON('site.json',{nav:[{id:'inicio',label:'Inicio',tipo:'inicio'}]}),
    getJSON('minutas/index.json',[]),
    getJSON('entregables.json',{items:[]})
  ]);
  const nav=document.getElementById('nav'),main=document.getElementById('main');
  site.nav.forEach(n=>{
    const a=mk('a',null,esc(n.label));a.href='#'+n.id;a.dataset.v=n.id;nav.appendChild(a);
    const v=(BUILDERS[n.tipo]||viewInicio)(n);v.id='view-'+n.id;v.hidden=true;main.appendChild(v);views[n.id]=v;
  });
  window.addEventListener('hashchange',show);
  show();
}
init();
})();
