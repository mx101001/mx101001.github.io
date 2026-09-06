import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evolve, seed, GUN } from '../assets/life-engine.mjs';
const board = coords => { const cells = new Uint8Array(25); for (const [x,y] of coords) cells[y*5+x] = 1; return cells; };
test('isolated cell dies', () => assert.deepEqual(evolve(board([[2,2]]),5,5),board([])));
test('block remains stable', () => { const b = board([[1,1],[2,1],[1,2],[2,2]]); assert.deepEqual(evolve(b,5,5),b); });
test('blinker oscillates without mutating current generation', () => { const b = board([[1,2],[2,2],[3,2]]); const n = evolve(b,5,5); assert.deepEqual(n,board([[2,1],[2,2],[2,3]])); assert.deepEqual(evolve(n,5,5),b); });
test('neighbours wrap at edges', () => assert.equal(evolve(board([[4,4],[0,4],[4,0]]),5,5)[0],1));
test('seed is a 36-cell Gosper gun', () => { assert.equal(GUN.length,36); assert.equal(seed().reduce((a,b)=>a+b,0),36); });
