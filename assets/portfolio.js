import { WIDTH, HEIGHT, createPattern, evolve } from './life-engine.mjs?v=2';
import { projects } from './project-data.mjs?v=2';
const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = $('life'), ctx = canvas.getContext('2d');
let world = createPattern('gosper'), age = 0, timer = null;
let running = !reducedMotion.matches, inView = false, activeDemo = 'life';
let selectedPattern = 'gosper', challenge = false, challengeStarted = false;
let cursor = {x:30, y:15}, keyboard = false, dragging = false, paint = 1;
let cursorPointer = null;

function draw() {
  ctx.fillStyle = '#0a0d16'; ctx.fillRect(0,0,canvas.width,canvas.height);
  const cw = canvas.width/WIDTH, ch = canvas.height/HEIGHT;
  for (let y=0;y<HEIGHT;y++) for (let x=0;x<WIDTH;x++) {
    const alive = world[y*WIDTH+x], size = alive ? cw-1.5 : 1.6;
    ctx.fillStyle = alive ? '#8c9bff' : '#28314a';
    ctx.fillRect(x*cw+(cw-size)/2,y*ch+(ch-size)/2,size,size);
  }
  if (keyboard && document.activeElement===canvas) {
    ctx.strokeStyle='#f9fdff';ctx.lineWidth=2;
    ctx.strokeRect(cursor.x*cw,cursor.y*ch,cw,ch);
  }
  $('generation').textContent=String(age).padStart(4,'0');
  $('population').textContent=world.reduce((a,b)=>a+b,0);
}
function schedule() {
  clearInterval(timer); timer=null;
  if(running && inView && !document.hidden && activeDemo==='life' && !$('project-dialog').open) timer=setInterval(advance,Number($('speed').value));
}
function setRunning(value) {
  running=value; schedule();
  $('play').innerHTML=running?'Pausa <span aria-hidden="true">Ⅱ</span>':'Avvia <span aria-hidden="true">▶</span>';
  $('play').setAttribute('aria-pressed',String(running));
  $('step').disabled=running;
  $('life-state').textContent=running?'IN ESECUZIONE':'IN PAUSA';
}
function challengeMessage(message) { $('challenge-status').hidden=false; $('challenge-status').textContent=message; }
function prepareChallenge() {
  if(!challenge || challengeStarted) return true;
  if(!world.some(Boolean)) { challengeMessage('La griglia è vuota: disegna prima qualche cella, poi premi Avvia.'); return false; }
  challengeStarted=true; age=0;
  challengeMessage('Sfida in corso: il tuo pattern deve avere ancora celle vive alla generazione 30.');
  return true;
}
function advance() {
  if(!prepareChallenge()) {setRunning(false);return;}
  world=evolve(world);age++;draw();
  if(challenge && challengeStarted && (age>=30 || !world.some(Boolean))) {
    setRunning(false);
    const alive=world.reduce((a,b)=>a+b,0);
    challengeMessage(alive ? `Sfida superata. ${alive} celle ancora vive dopo 30 generazioni! Prova con una forma diversa.` : `Il pattern si è spento alla generazione ${age}. Riprova: una cella viva sopravvive con 2 o 3 vicine.`);
    challenge=false;challengeStarted=false;
  }
}
function endChallenge(){challenge=false;challengeStarted=false;$('challenge-status').hidden=true;}
function resetPattern(name=selectedPattern){
  setRunning(false);endChallenge();selectedPattern=name;world=createPattern(name);age=0;draw();
  document.querySelectorAll('[data-pattern]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pattern===name)));
  $('board-status').textContent=`Pattern ${name} caricato.`;
}
$('play').addEventListener('click',()=>{if(!running&&!prepareChallenge()) return;setRunning(!running);});
$('step').addEventListener('click',()=>{advance();$('board-status').textContent=`Generazione ${age}, ${$('population').textContent} celle vive.`;});
$('reset').addEventListener('click',()=>resetPattern());
$('clear').addEventListener('click',()=>{setRunning(false);endChallenge();world.fill(0);age=0;draw();document.querySelectorAll('[data-pattern]').forEach(b=>b.setAttribute('aria-pressed','false'));$('board-status').textContent='Griglia vuota. Disegna il tuo pattern.';});
document.querySelectorAll('[data-pattern]').forEach(b=>b.addEventListener('click',()=>resetPattern(b.dataset.pattern)));
$('challenge').addEventListener('click',()=>{setRunning(false);world.fill(0);age=0;challenge=true;challengeStarted=false;draw();document.querySelectorAll('[data-pattern]').forEach(b=>b.setAttribute('aria-pressed','false'));challengeMessage('Disegna un pattern che sopravviva per 30 generazioni. Poi premi Avvia. Suggerimento: prova a tenere vicine le celle.');canvas.focus({preventScroll:true});});
$('speed').addEventListener('change',schedule);
document.addEventListener('visibilitychange',schedule);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)setRunning(false);});
function cellAt(event){const r=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(WIDTH-1,Math.floor((event.clientX-r.left)/r.width*WIDTH))),y:Math.max(0,Math.min(HEIGHT-1,Math.floor((event.clientY-r.top)/r.height*HEIGHT))) };}
function preparePaint(){setRunning(false);if(challengeStarted){challengeStarted=false;age=0;challengeMessage('Pattern modificato: la sfida riparte da zero. Premi Avvia quando è pronto.');}document.querySelectorAll('[data-pattern]').forEach(b=>b.setAttribute('aria-pressed','false'));}
function paintLine(from,to){const steps=Math.max(Math.abs(to.x-from.x),Math.abs(to.y-from.y));for(let i=0;i<=steps;i++){const t=steps?i/steps:0;world[Math.round(from.y+(to.y-from.y)*t)*WIDTH+Math.round(from.x+(to.x-from.x)*t)]=paint;}}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0||cursorPointer!==null)return;preparePaint();keyboard=false;dragging=true;cursorPointer=e.pointerId;canvas.setPointerCapture(e.pointerId);cursor=cellAt(e);paint=1-world[cursor.y*WIDTH+cursor.x];paintLine(cursor,cursor);draw();});
canvas.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==cursorPointer)return;const next=cellAt(e);paintLine(cursor,next);cursor=next;draw();});
for(const event of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(event,e=>{if(e.pointerId===cursorPointer){dragging=false;cursorPointer=null;}});
canvas.addEventListener('focus',()=>{keyboard=true;draw();});canvas.addEventListener('blur',()=>{keyboard=false;draw();});
canvas.addEventListener('keydown',e=>{
  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter'].includes(e.key))return;
  e.preventDefault();keyboard=true;setRunning(false);
  if(e.key==='ArrowUp')cursor.y=(cursor.y+HEIGHT-1)%HEIGHT;
  if(e.key==='ArrowDown')cursor.y=(cursor.y+1)%HEIGHT;
  if(e.key==='ArrowLeft')cursor.x=(cursor.x+WIDTH-1)%WIDTH;
  if(e.key==='ArrowRight')cursor.x=(cursor.x+1)%WIDTH;
  const i=cursor.y*WIDTH+cursor.x;
  if(e.key===' '||e.key==='Enter'){preparePaint();world[i]=1-world[i];}
  $('board-status').textContent=`Colonna ${cursor.x+1}, riga ${cursor.y+1}: cella ${world[i]?'viva':'vuota'}.`;draw();
});

// Both tab groups follow the roving-tabindex keyboard pattern.
function keyboardTabs(container,select){
  container.addEventListener('keydown',e=>{
    const vertical=container.getAttribute('aria-orientation')==='vertical';
    const previous=vertical?'ArrowUp':'ArrowLeft',next=vertical?'ArrowDown':'ArrowRight';
    if(![previous,next,'Home','End'].includes(e.key))return;
    const tabs=[...container.querySelectorAll('[role=tab]')],index=tabs.indexOf(document.activeElement);
    if(index<0)return;e.preventDefault();
    const target=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key===next?1:-1)+tabs.length)%tabs.length;
    select(tabs[target]);tabs[target].focus();
  });
}
function selectDemo(name){
  activeDemo=name;
  document.querySelectorAll('[data-demo]').forEach(b=>{const on=b.dataset.demo===name;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$(b.getAttribute('aria-controls')).hidden=!on;});
  $('demo-stack').textContent=name==='life'?'C → JAVASCRIPT / B3 · S23':'REACT / TYPESCRIPT / RESPONSIVE UI';schedule();
}
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>selectDemo(b.dataset.demo)));
keyboardTabs(document.querySelector('.project-tabs'),b=>selectDemo(b.dataset.demo));
function setViewport(value){
  const width=Math.max(40,Math.min(100,Number(value)));$('ekos-frame').style.width=`${width}%`;$('viewport-width').value=String(width);$('viewport-label').value=`${width}%`;
  document.querySelectorAll('[data-width]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.width)===width)));
}
document.querySelectorAll('[data-width]').forEach(b=>b.addEventListener('click',()=>setViewport(b.dataset.width)));
$('viewport-width').addEventListener('input',e=>setViewport(e.target.value));
function selectStep(button){document.querySelectorAll('[data-step]').forEach(b=>{const on=b===button;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$(b.getAttribute('aria-controls')).hidden=!on;});}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>selectStep(b)));
keyboardTabs(document.querySelector('.workflow-steps'),selectStep);

let dialogProject='life',returnFocus=null;
function openProject(name){
  const project=projects[name];if(!project)return;
  returnFocus=document.activeElement;dialogProject=name;
  $('dialog-title').textContent=project.title;$('dialog-meta').textContent=project.meta;$('dialog-description').textContent=project.description;
  $('dialog-notes').replaceChildren(...project.notes.map(([title,body])=>{const section=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=body;section.append(h,p);return section;}));
  $('dialog-file').textContent=project.file;$('dialog-source').textContent=project.source;$('dialog-repo').href=project.repo;$('dialog-source-link').href=project.sourceUrl;
  $('project-dialog').showModal();$('project-dialog').scrollTop=0;document.body.classList.add('dialog-open');schedule();
}
document.querySelectorAll('[data-open-project]').forEach(b=>{b.setAttribute('aria-haspopup','dialog');b.addEventListener('click',()=>openProject(b.dataset.openProject));});
$('inspect-project').addEventListener('click',()=>openProject(activeDemo));
$('close-dialog').addEventListener('click',()=>$('project-dialog').close());
$('project-dialog').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();if(e.target===e.currentTarget&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))e.currentTarget.close();});
$('project-dialog').addEventListener('close',()=>{document.body.classList.remove('dialog-open');schedule();returnFocus?.focus({preventScroll:true});});
$('dialog-try').addEventListener('click',()=>{$('project-dialog').close();selectDemo(dialogProject);$('laboratorio').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});$(`tab-${dialogProject}`).focus({preventScroll:true});returnFocus=null;});
$('copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('dario.mongardini@gmail.com');$('copy-status').textContent='Indirizzo copiato.';}catch{$('copy-status').textContent='Seleziona l’indirizzo per copiarlo, oppure apri il link email.';}});

if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.05}).observe($('laboratorio'));
  const sections=[...document.querySelectorAll('main>section[id]')],navLinks=[...document.querySelectorAll('.dock a')];
  let scrollQueued=false;
  function updateDock(){scrollQueued=false;let current=sections[0].id;for(const section of sections)if(section.getBoundingClientRect().top<=innerHeight*.4)current=section.id;for(const a of navLinks){if(a.hash===`#${current}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateDock);}},{passive:true});updateDock();
  if(!reducedMotion.matches){
    const items=document.querySelectorAll('.project-card,.skill-map,.contact-section');
    document.body.classList.add('reveal-enabled');
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.06});
    items.forEach(item=>{item.classList.add('reveal-item');observer.observe(item);});
  }
}else{inView=true;}
draw();setRunning(running);
