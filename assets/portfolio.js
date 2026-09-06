import { WIDTH, HEIGHT, seed, evolve } from './life-engine.mjs';
const canvas = document.getElementById('life');
const ctx = canvas.getContext('2d');
const play = document.getElementById('play');
const generation = document.getElementById('generation');
const population = document.getElementById('population');
const status = document.getElementById('board-status');
const speed = document.getElementById('speed');
let world = seed(), age = 0, timer = null, running = false;
let cursor = {x: 30, y: 15}, keyboard = false, dragging = false, paint = 1;
function draw() {
  ctx.fillStyle = '#151713';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const cw = canvas.width / WIDTH, ch = canvas.height / HEIGHT;
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
    ctx.fillStyle = world[y * WIDTH + x] ? '#d6e8a7' : '#2c3126';
    const size = world[y * WIDTH + x] ? cw - 2 : 1.5;
    ctx.fillRect(x*cw + (cw-size)/2, y*ch + (ch-size)/2, size, size);
  }
  if (keyboard && document.activeElement === canvas) {
    ctx.strokeStyle = '#ff7a45'; ctx.lineWidth = 2;
    ctx.strokeRect(cursor.x*cw, cursor.y*ch, cw, ch);
  }
  generation.textContent = String(age).padStart(4, '0');
  population.textContent = world.reduce((sum, cell) => sum + cell, 0);
}
function advance() { world = evolve(world); age++; draw(); }
function schedule() {
  clearInterval(timer); timer = null;
  if (running && !document.hidden) timer = setInterval(advance, Number(speed.value));
}
function setRunning(value) {
  running = value; schedule();
  play.innerHTML = running ? 'Pausa <span aria-hidden="true">Ⅱ</span>' : 'Avvia <span aria-hidden="true">▶</span>';
  play.setAttribute('aria-pressed', String(running));
  document.getElementById('life-state').textContent = running ? 'IN ESECUZIONE' : 'IN PAUSA';
  document.getElementById('step').disabled = running;
}
play.addEventListener('click', () => setRunning(!running));
document.getElementById('step').addEventListener('click', () => { advance(); status.textContent = `Generazione ${age}, ${population.textContent} celle vive.`; });
document.getElementById('reset').addEventListener('click', () => { setRunning(false); world = seed(); age = 0; draw(); status.textContent = 'Pattern Gosper ripristinato.'; });
document.getElementById('clear').addEventListener('click', () => { setRunning(false); world.fill(0); age = 0; draw(); status.textContent = 'Griglia vuota. Disegna un nuovo pattern.'; });
speed.addEventListener('change', schedule);
document.addEventListener('visibilitychange', schedule);
function cellAt(event) {
  const rect = canvas.getBoundingClientRect();
  return {x: Math.max(0, Math.min(WIDTH-1, Math.floor((event.clientX-rect.left)/rect.width*WIDTH))), y: Math.max(0, Math.min(HEIGHT-1, Math.floor((event.clientY-rect.top)/rect.height*HEIGHT)))};
}
canvas.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  setRunning(false); keyboard = false; dragging = true;
  canvas.setPointerCapture(event.pointerId); cursor = cellAt(event);
  paint = world[cursor.y*WIDTH+cursor.x] ? 0 : 1;
  world[cursor.y*WIDTH+cursor.x] = paint; draw();
});
canvas.addEventListener('pointermove', event => { if (!dragging) return; cursor = cellAt(event); world[cursor.y*WIDTH+cursor.x] = paint; draw(); });
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, () => { dragging = false; });
canvas.addEventListener('focus', () => { keyboard = true; draw(); });
canvas.addEventListener('blur', () => { keyboard = false; draw(); });
canvas.addEventListener('keydown', event => {
  if (!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter'].includes(event.key)) return;
  event.preventDefault(); keyboard = true; setRunning(false);
  if (event.key === 'ArrowUp') cursor.y = (cursor.y + HEIGHT - 1) % HEIGHT;
  if (event.key === 'ArrowDown') cursor.y = (cursor.y + 1) % HEIGHT;
  if (event.key === 'ArrowLeft') cursor.x = (cursor.x + WIDTH - 1) % WIDTH;
  if (event.key === 'ArrowRight') cursor.x = (cursor.x + 1) % WIDTH;
  const index = cursor.y * WIDTH + cursor.x;
  if (event.key === ' ' || event.key === 'Enter') world[index] = 1 - world[index];
  status.textContent = `Colonna ${cursor.x+1}, riga ${cursor.y+1}: cella ${world[index] ? 'viva' : 'vuota'}.`;
  draw();
});
draw();
