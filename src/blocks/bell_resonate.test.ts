import { describe, it, expect } from 'vitest';
import {
  highlightTargets,
  glowExpiresAt,
  villagersFleeing,
  GLOW_DURATION_MS,
} from './bell_resonate';

describe('bell resonate', () => {
  it('highlights nearby raid mobs', () => {
    const r = highlightTargets({ ringPos: { x: 0, y: 64, z: 0 }, nowMs: 0 }, [
      { id: 'p1', pos: { x: 5, y: 64, z: 5 }, mobType: 'pillager' },
      { id: 'p2', pos: { x: 100, y: 64, z: 0 }, mobType: 'pillager' },
      { id: 'c1', pos: { x: 5, y: 64, z: 5 }, mobType: 'cow' },
    ]);
    expect(r).toEqual(['p1']);
  });

  it('glow expires after duration', () => {
    expect(glowExpiresAt(1000)).toBe(1000 + GLOW_DURATION_MS);
  });

  it('villagers flee on raid + mobs', () => {
    expect(villagersFleeing(true, true)).toBe(true);
    expect(villagersFleeing(true, false)).toBe(false);
  });
});
