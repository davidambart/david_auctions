const archive=document.querySelector('#archive');
const search=document.querySelector('#search');
const yearSelect=document.querySelector('#year');
const sortSelect=document.querySelector('#sort');
const empty=document.querySelector('#empty');
const loadError=document.querySelector('#load-error');
let data=[];
let reportEmbedHeight=()=>{};

function setupEmbedHeight(){
  if(window.self===window.top)return;
  let framePending=false;
  reportEmbedHeight=()=>{
    if(framePending)return;
    framePending=true;
    requestAnimationFrame(()=>{
      framePending=false;
      const height=Math.ceil(document.querySelector('main').getBoundingClientRect().bottom);
      window.parent.postMessage({type:'auction-archive-height',height},'*');
    });
  };
  new ResizeObserver(reportEmbedHeight).observe(document.querySelector('main'));
  window.addEventListener('load',reportEmbedHeight);
  reportEmbedHeight();
}

function parseCSV(text){
  const rows=[]; let row=[],field='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(quoted){
      if(c==='"'&&n==='"'){field+='"';i++;}
      else if(c==='"'){quoted=false;}
      else field+=c;
    }else{
      if(c==='"') quoted=true;
      else if(c===','){row.push(field);field='';}
      else if(c==='\n'){row.push(field);rows.push(row);row=[];field='';}
      else if(c!=='\r') field+=c;
    }
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  const headers=rows.shift()||[];
  return rows.filter(r=>r.some(v=>v!=='')).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function bidValue(value=''){return Number(String(value).replace(/[^0-9]/g,''))||0;}
// ECB daily reference rates: US dollars per euro on each USD auction's end date.
// https://data.ecb.europa.eu/data/datasets/EXR/EXR.D.USD.EUR.SP00.A
const usdPerEuro={
  '2018-05-17':1.1805,
  '2018-05-24':1.1728,
  '2018-05-31':1.1699,
  '2018-06-07':1.1836,
  '2018-06-14':1.173,
  '2018-06-21':1.1538,
  '2018-07-19':1.1588,
  '2018-08-02':1.1617,
  '2018-08-09':1.1593,
  '2020-06-05':1.133
};
function auctionResultEuro(w){
  const amount=bidValue(w.winningBid);
  if(!/\$|\bUSD\b/i.test(w.winningBid))return amount;
  const rate=usdPerEuro[w.auctionEndISO];
  return rate?Math.round(amount/rate*100)/100:amount;
}
function card(w){
  const charity=w.charity?`<div class="charity-row"><dt>Charity</dt><dd>${esc(w.charity)}</dd></div>`:'';
  const imgs=JSON.stringify(w.images).replace(/'/g,'&#39;');
  const imageTitle=`${w.title}, ${w.year} — David Ambarzumjan`;
  return `<article class="artwork" data-title="${esc(w.title.toLowerCase())}" data-year="${esc(w.year)}" data-auction-date="${esc(w.auctionEndISO)}" data-result-eur="${auctionResultEuro(w)}" data-id="${esc(w.id)}">
    <button class="image-button" type="button" aria-label="View ${esc(w.title)} image gallery" data-images='${imgs}' data-title="${esc(w.title)}">
      <img src="${esc(w.image)}" alt="${esc(imageTitle)}" title="${esc(imageTitle)}" loading="lazy">
    </button>
    <div class="meta">
      <div><h2>${esc(w.title)}</h2><p class="year">${esc(w.year)}</p></div>
      <dl>
        <div><dt>Medium</dt><dd>${esc(w.medium)}</dd></div>
        <div><dt>Auction ended</dt><dd><time datetime="${esc(w.auctionEndISO)}">${esc(w.auctionEndDisplay)}</time></dd></div>
        <div><dt>Winning bid</dt><dd>${esc(w.winningBid)}</dd></div>
        ${charity}
      </dl>
    </div>
  </article>`;
}
function setupViewer(){
  const viewer=document.querySelector('#viewer'),vimg=viewer.querySelector('img'),vtitle=viewer.querySelector('.viewer-caption p'),counter=viewer.querySelector('.image-counter'),prev=viewer.querySelector('.previous'),next=viewer.querySelector('.next');
  let gallery=[],galleryIndex=0,touchStartX=0,touchStartY=0;
  function renderImage(direction=0){if(!gallery.length)return;vimg.classList.remove('slide-left','slide-right');void vimg.offsetWidth;vimg.style.objectFit='contain';vimg.src=gallery[galleryIndex];vimg.alt=`${vtitle.textContent} by David Ambarzumjan, image ${galleryIndex+1} of ${gallery.length}`;vimg.title=`${vtitle.textContent} — David Ambarzumjan`;counter.textContent=`${galleryIndex+1} / ${gallery.length}`;prev.hidden=gallery.length<2;next.hidden=gallery.length<2;if(direction)vimg.classList.add(direction>0?'slide-left':'slide-right');}
  function move(step){if(gallery.length<2)return;galleryIndex=(galleryIndex+step+gallery.length)%gallery.length;renderImage(step);}
  document.querySelectorAll('.image-button').forEach(b=>b.addEventListener('click',()=>{if(window.self!==window.top)return;try{gallery=JSON.parse(b.dataset.images||'[]'); gallery=[...new Set(gallery)]}catch{gallery=[]}galleryIndex=0;vtitle.textContent=b.dataset.title;renderImage();viewer.showModal();document.body.classList.add('viewer-open');}));
  prev.addEventListener('click',e=>{e.stopPropagation();move(-1)});next.addEventListener('click',e=>{e.stopPropagation();move(1)});
  function closeViewer(){if(viewer.open)viewer.close();document.body.classList.remove('viewer-open');vimg.src='';}
  viewer.querySelector('.close').addEventListener('click',closeViewer);viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
  viewer.addEventListener('cancel',e=>{e.preventDefault();closeViewer()});
  document.addEventListener('keydown',e=>{if(!viewer.open)return;if(e.key==='Escape')closeViewer();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
  viewer.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStartX=t.clientX;touchStartY=t.clientY},{passive:true});
  viewer.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-touchStartX,dy=t.clientY-touchStartY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1)},{passive:true});
}
function filter(){
const q=search.value.trim().toLowerCase(),y=yearSelect.value;
let cards=[...document.querySelectorAll('.artwork')];
const cmp={
latest:(a,b)=>b.dataset.auctionDate.localeCompare(a.dataset.auctionDate)||Number(a.dataset.id)-Number(b.dataset.id),
earliest:(a,b)=>a.dataset.auctionDate.localeCompare(b.dataset.auctionDate)||Number(a.dataset.id)-Number(b.dataset.id),
high:(a,b)=>Number(b.dataset.resultEur)-Number(a.dataset.resultEur)||Number(a.dataset.id)-Number(b.dataset.id),
low:(a,b)=>Number(a.dataset.resultEur)-Number(b.dataset.resultEur)||Number(a.dataset.id)-Number(b.dataset.id)
}[sortSelect.value||'latest'];
cards.sort(cmp).forEach(c=>archive.appendChild(c));
cards.forEach(w=>{const matchesSearch=!q||w.dataset.title.includes(q)||w.dataset.year.includes(q);w.hidden=!matchesSearch||(y!=='all'&&w.dataset.year!==y);});
const vis=cards.filter(c=>!c.hidden);
empty.hidden=vis.length!==0;
reportEmbedHeight();
}
async function init(){
  try{
    const response=await fetch('data/auctions.csv',{cache:'no-store'}); if(!response.ok) throw new Error(response.status);
    data=parseCSV(await response.text()).map(w=>({...w,images:(w.images||w.image).split('|').map(x=>x.trim()).filter(Boolean)}));
    data.sort((a,b)=>String(b.auctionEndISO).localeCompare(String(a.auctionEndISO))||Number(a.id)-Number(b.id));
    const years=[...new Set(data.map(w=>String(w.year)))].sort((a,b)=>Number(b)-Number(a)); years.forEach(y=>yearSelect.insertAdjacentHTML('beforeend',`<option value="${esc(y)}">${esc(y)}</option>`));
    const nums=data.map(w=>Number(w.year)).filter(Number.isFinite); document.querySelector('#count').textContent=`${data.length} works · ${Math.min(...nums)}–${Math.max(...nums)}`;
    archive.innerHTML=data.map(card).join('');setupViewer();reportEmbedHeight();
    search.addEventListener('input',filter);yearSelect.addEventListener('change',filter);sortSelect.addEventListener('change',filter);document.querySelector('#reset').addEventListener('click',()=>{search.value='';yearSelect.value='all';sortSelect.value='latest';filter()});
  }catch(err){console.error(err);loadError.hidden=false;}
}
setupEmbedHeight();
init();
