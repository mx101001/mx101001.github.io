// Conway B3/S23 on a torus. Separate buffers keep each generation simultaneous.
export const WIDTH = 80;
export const HEIGHT = 40;
export const GUN = [[24,0],[22,1],[24,1],[12,2],[13,2],[20,2],[21,2],[34,2],[35,2],[11,3],[15,3],[20,3],[21,3],[34,3],[35,3],[0,4],[1,4],[10,4],[16,4],[20,4],[21,4],[0,5],[1,5],[10,5],[14,5],[16,5],[17,5],[22,5],[24,5],[10,6],[16,6],[24,6],[11,7],[15,7],[12,8],[13,8]];
export function seed() {
  const cells = new Uint8Array(WIDTH * HEIGHT);
  for (const [x,y] of GUN) cells[(y + 8) * WIDTH + x + 12] = 1;
  return cells;
}
export function evolve(cells, width = WIDTH, height = HEIGHT) {
  const next = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    let neighbours = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (dx || dy) neighbours += cells[((y + dy + height) % height) * width + (x + dx + width) % width];
    }
    const i = y * width + x;
    next[i] = Number(neighbours === 3 || (cells[i] === 1 && neighbours === 2));
  }
  return next;
}

export function createPattern(name, random = Math.random) {
  if (name === 'gosper') return seed();
  const cells = new Uint8Array(WIDTH * HEIGHT);
  if (name === 'glider') {
    for (const [x,y] of [[1,0],[2,1],[0,2],[1,2],[2,2]]) cells[(y+18)*WIDTH+x+38]=1;
  } else if (name === 'chaos') {
    for (let y=10;y<30;y++) for (let x=20;x<60;x++) cells[y*WIDTH+x]=Number(random()<0.28);
  }
  return cells;
}
