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

  it('glows raid mobs in 32-48 shell when one is inside 32 (wiki)', () => {
    // p1 inside trigger (32) → triggers; p2 in 32-48 shell → glows;
    // p3 beyond 48 → does not glow.
    const r = highlightTargets({ ringPos: { x: 0, y: 64, z: 0 }, nowMs: 0 }, [
      { id: 'p1', pos: { x: 10, y: 64, z: 0 }, mobType: 'pillager' },
      { id: 'p2', pos: { x: 40, y: 64, z: 0 }, mobType: 'pillager' },
      { id: 'p3', pos: { x: 60, y: 64, z: 0 }, mobType: 'pillager' },
    ]);
    expect(r).toContain('p1');
    expect(r).toContain('p2');
    expect(r).not.toContain('p3');
  });

  it('does not glow if no raid mob within 32 trigger (wiki)', () => {
    // Only pillager at 40 blocks — outside trigger range, no glow.
    const r = highlightTargets({ ringPos: { x: 0, y: 64, z: 0 }, nowMs: 0 }, [
      { id: 'p1', pos: { x: 40, y: 64, z: 0 }, mobType: 'pillager' },
    ]);
    expect(r).toEqual([]);
  });

  it('glow expires after duration', () => {
    expect(glowExpiresAt(1000)).toBe(1000 + GLOW_DURATION_MS);
  });

  it('villagers flee on raid + mobs', () => {
    expect(villagersFleeing(true, true)).toBe(true);
    expect(villagersFleeing(true, false)).toBe(false);
  });
});
