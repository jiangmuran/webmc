import { describe, it, expect } from 'vitest';
import { tensionStep, canLeash, LEASH_MAX_PULL, LEASH_BREAK } from './leash_tether';

describe('leash tether', () => {
  it('no tension close', () => {
    const r = tensionStep({ anchorPos: { x: 0, y: 0, z: 0 }, mobPos: { x: 2, y: 0, z: 0 } });
    expect(r.broken).toBe(false);
    expect(r.pullVec).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('pulls at threshold', () => {
    const r = tensionStep({
      anchorPos: { x: 0, y: 0, z: 0 },
      mobPos: { x: LEASH_MAX_PULL + 2, y: 0, z: 0 },
    });
    expect(r.pullVec.x).toBeLessThan(0);
  });

  it('breaks past max', () => {
    const r = tensionStep({
      anchorPos: { x: 0, y: 0, z: 0 },
      mobPos: { x: LEASH_BREAK + 1, y: 0, z: 0 },
    });
    expect(r.broken).toBe(true);
  });

  it('leashable list', () => {
    expect(canLeash('cow')).toBe(true);
    expect(canLeash('zombie')).toBe(false);
  });
});
