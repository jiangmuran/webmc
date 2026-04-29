import { describe, it, expect } from 'vitest';
import { detectTShape } from './wither_summon_pattern';

function makeWorld(blocks: Record<string, string>): (x: number, y: number, z: number) => string {
  return (x, y, z) => blocks[`${x},${y},${z}`] ?? 'air';
}

describe('wither summon pattern', () => {
  it('valid T on x axis', () => {
    const w = makeWorld({
      '0,0,0': 'soul_sand',
      '1,0,0': 'soul_sand',
      '-1,0,0': 'soul_sand',
      '0,1,0': 'soul_sand',
      '1,1,0': 'soul_sand',
      '-1,1,0': 'soul_sand',
      '0,2,0': 'wither_skeleton_skull',
      '1,2,0': 'wither_skeleton_skull',
      '-1,2,0': 'wither_skeleton_skull',
    });
    expect(detectTShape(0, 0, 0, w, 'x')).toBe(true);
  });

  it('missing skull → no', () => {
    const w = makeWorld({
      '0,0,0': 'soul_sand',
      '1,0,0': 'soul_sand',
      '-1,0,0': 'soul_sand',
      '0,1,0': 'soul_sand',
      '1,1,0': 'soul_sand',
      '-1,1,0': 'soul_sand',
      '0,2,0': 'wither_skeleton_skull',
      '1,2,0': 'wither_skeleton_skull',
    });
    expect(detectTShape(0, 0, 0, w, 'x')).toBe(false);
  });

  it('wrong base → no', () => {
    const w = makeWorld({
      '0,0,0': 'sand',
      '1,0,0': 'soul_sand',
      '-1,0,0': 'soul_sand',
      '0,1,0': 'soul_sand',
      '1,1,0': 'soul_sand',
      '-1,1,0': 'soul_sand',
      '0,2,0': 'wither_skeleton_skull',
      '1,2,0': 'wither_skeleton_skull',
      '-1,2,0': 'wither_skeleton_skull',
    });
    expect(detectTShape(0, 0, 0, w, 'x')).toBe(false);
  });

  it('canonical T (4 soul blocks) summons (wiki)', () => {
    // 1 stem at (0,0,0), 3 top at y=1, 3 skulls at y=2 — bottom flanks
    // intentionally air-only since the wiki T has no bottom row flanks.
    const w = makeWorld({
      '0,0,0': 'soul_sand',
      '0,1,0': 'soul_sand',
      '1,1,0': 'soul_sand',
      '-1,1,0': 'soul_sand',
      '0,2,0': 'wither_skeleton_skull',
      '1,2,0': 'wither_skeleton_skull',
      '-1,2,0': 'wither_skeleton_skull',
    });
    expect(detectTShape(0, 0, 0, w, 'x')).toBe(true);
  });

  it('soul soil works as base', () => {
    const w = makeWorld({
      '0,0,0': 'soul_soil',
      '0,0,1': 'soul_soil',
      '0,0,-1': 'soul_soil',
      '0,1,0': 'soul_soil',
      '0,1,1': 'soul_soil',
      '0,1,-1': 'soul_soil',
      '0,2,0': 'wither_skeleton_skull',
      '0,2,1': 'wither_skeleton_skull',
      '0,2,-1': 'wither_skeleton_skull',
    });
    expect(detectTShape(0, 0, 0, w, 'z')).toBe(true);
  });
});
