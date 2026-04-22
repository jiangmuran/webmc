import { describe, it, expect } from 'vitest';
import { matchesWitherPattern } from './wither_build';

function buildWorld(blocks: Record<string, string>): (x: number, y: number, z: number) => string {
  return (x, y, z) => blocks[`${x},${y},${z}`] ?? 'webmc:air';
}

describe('wither build', () => {
  it('matches X-axis T', () => {
    const world: Record<string, string> = {};
    for (let k = -1; k <= 1; k++) world[`${k},0,0`] = 'webmc:soul_sand';
    world[`0,1,0`] = 'webmc:soul_sand';
    for (let k = -1; k <= 1; k++) world[`${k},2,0`] = 'webmc:wither_skeleton_skull';
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('x');
  });

  it('matches Z-axis T', () => {
    const world: Record<string, string> = {};
    for (let k = -1; k <= 1; k++) world[`0,0,${k}`] = 'webmc:soul_soil';
    world[`0,1,0`] = 'webmc:soul_soil';
    for (let k = -1; k <= 1; k++) world[`0,2,${k}`] = 'webmc:wither_skeleton_skull';
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('z');
  });

  it('no match', () => {
    expect(matchesWitherPattern({ at: () => 'webmc:air', px: 0, py: 0, pz: 0 })).toBeNull();
  });

  it('mixed soul types ok', () => {
    const world: Record<string, string> = {
      '-1,0,0': 'webmc:soul_sand',
      '0,0,0': 'webmc:soul_soil',
      '1,0,0': 'webmc:soul_sand',
      '0,1,0': 'webmc:soul_soil',
      '-1,2,0': 'webmc:wither_skeleton_skull',
      '0,2,0': 'webmc:wither_skeleton_skull',
      '1,2,0': 'webmc:wither_skeleton_skull',
    };
    expect(matchesWitherPattern({ at: buildWorld(world), px: 0, py: 0, pz: 0 })).toBe('x');
  });
});
