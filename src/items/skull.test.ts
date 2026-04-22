import { describe, it, expect } from 'vitest';
import { SKULLS, detectWitherSummon } from './skull';

describe('skulls', () => {
  it('has 7 skull kinds', () => {
    expect(Object.keys(SKULLS).length).toBe(7);
  });

  it('only wither skeleton skulls trigger summon flag', () => {
    expect(SKULLS.wither_skeleton_skull.witherSummon).toBe(true);
    expect(SKULLS.zombie_head.witherSummon).toBe(false);
  });

  it('wither summon formation detected', () => {
    const grid = new Map<string, string>();
    const key = (x: number, y: number, z: number): string =>
      `${x.toString()},${y.toString()},${z.toString()}`;
    grid.set(key(0, 0, 0), 'webmc:soul_sand');
    for (const dx of [-1, 0, 1]) grid.set(key(dx, 1, 0), 'webmc:soul_sand');
    for (const dx of [-1, 0, 1]) grid.set(key(dx, 2, 0), 'webmc:wither_skeleton_skull');
    const ok = detectWitherSummon(
      { x: 0, y: 0, z: 0 },
      { blockName: (x, y, z) => grid.get(key(x, y, z)) ?? 'webmc:air' },
    );
    expect(ok).toBe(true);
  });

  it('wrong skull type does not trigger summon', () => {
    const grid = new Map<string, string>();
    const key = (x: number, y: number, z: number): string =>
      `${x.toString()},${y.toString()},${z.toString()}`;
    grid.set(key(0, 0, 0), 'webmc:soul_sand');
    for (const dx of [-1, 0, 1]) grid.set(key(dx, 1, 0), 'webmc:soul_sand');
    for (const dx of [-1, 0, 1]) grid.set(key(dx, 2, 0), 'webmc:skeleton_skull');
    const ok = detectWitherSummon(
      { x: 0, y: 0, z: 0 },
      { blockName: (x, y, z) => grid.get(key(x, y, z)) ?? 'webmc:air' },
    );
    expect(ok).toBe(false);
  });
});
