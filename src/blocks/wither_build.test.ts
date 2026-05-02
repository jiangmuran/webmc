import { describe, it, expect } from 'vitest';
import { matchesWitherPattern } from './wither_build';

function buildWorld(blocks: Record<string, string>): (x: number, y: number, z: number) => string {
  return (x, y, z) => blocks[`${x},${y},${z}`] ?? 'webmc:air';
}

describe('wither build', () => {
  // Wiki canonical T (px,py,pz at the stem):
  //   y+2: skulls at axis offsets -1, 0, 1
  //   y+1: souls at axis offsets -1, 0, 1
  //   y+0: 1 soul at center
  it('matches X-axis T (wiki: stem at py, crossbar at py+1, skulls at py+2)', () => {
    const world: Record<string, string> = {};
    world[`0,0,0`] = 'webmc:soul_sand';
    for (let k = -1; k <= 1; k++) world[`${k},1,0`] = 'webmc:soul_sand';
    for (let k = -1; k <= 1; k++) world[`${k},2,0`] = 'webmc:wither_skeleton_skull';
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('x');
  });

  it('matches Z-axis T', () => {
    const world: Record<string, string> = {};
    world[`0,0,0`] = 'webmc:soul_soil';
    for (let k = -1; k <= 1; k++) world[`0,1,${k}`] = 'webmc:soul_soil';
    for (let k = -1; k <= 1; k++) world[`0,2,${k}`] = 'webmc:wither_skeleton_skull';
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('z');
  });

  it('no match', () => {
    expect(matchesWitherPattern({ at: () => 'webmc:air', px: 0, py: 0, pz: 0 })).toBeNull();
  });

  it('mixed soul types ok', () => {
    const world: Record<string, string> = {
      '0,0,0': 'webmc:soul_sand',
      '-1,1,0': 'webmc:soul_soil',
      '0,1,0': 'webmc:soul_sand',
      '1,1,0': 'webmc:soul_soil',
      '-1,2,0': 'webmc:wither_skeleton_skull',
      '0,2,0': 'webmc:wither_skeleton_skull',
      '1,2,0': 'webmc:wither_skeleton_skull',
    };
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('x');
  });

  it('rejects floating-skull (3-soul base + skulls without crossbar)', () => {
    // Pre-fix layout: 3 souls at y=0, 1 soul at y=1, skulls at y=2 with
    // -1/+1 skulls floating. Wiki forbids this; the +/-1 skulls have no
    // soul-block support so a player could not even place them.
    const world: Record<string, string> = {};
    for (let k = -1; k <= 1; k++) world[`${k},0,0`] = 'webmc:soul_sand';
    world[`0,1,0`] = 'webmc:soul_sand';
    for (let k = -1; k <= 1; k++) world[`${k},2,0`] = 'webmc:wither_skeleton_skull';
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBeNull();
  });
});
