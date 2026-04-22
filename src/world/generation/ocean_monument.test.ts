import { describe, it, expect } from 'vitest';
import { isInsideMonument, MONUMENT_ROOMS, planMonument } from './ocean_monument';

describe('ocean monument', () => {
  it('plan has 3 elder guardians', () => {
    const p = planMonument({ rng: () => 0.5 });
    expect(p.elderGuardianCount).toBe(3);
  });

  it('treasure core has 8 gold blocks', () => {
    const p = planMonument({ rng: () => 0.5 });
    expect(p.goldBlocksInTreasure).toBe(8);
  });

  it('monument bounding box is 58×22×58', () => {
    const p = planMonument({ rng: () => 0 });
    expect(p.boundingBox).toEqual({ width: 58, height: 22, depth: 58 });
  });

  it('elder chamber always has exactly 3 rooms', () => {
    const def = MONUMENT_ROOMS.elder_chamber;
    expect(def.minCount).toBe(3);
    expect(def.maxCount).toBe(3);
  });

  it('isInsideMonument accepts points in the box', () => {
    expect(isInsideMonument({ x: 5, y: 5, z: 5 }, { x: 0, y: 0, z: 0 })).toBe(true);
  });

  it('isInsideMonument rejects out-of-box points', () => {
    expect(isInsideMonument({ x: 100, y: 5, z: 5 }, { x: 0, y: 0, z: 0 })).toBe(false);
  });

  it('corridor count is within min/max', () => {
    const p = planMonument({ rng: () => 0.5 });
    const c = p.rooms.find((r) => r.kind === 'corridor');
    expect(c?.count).toBeGreaterThanOrEqual(MONUMENT_ROOMS.corridor.minCount);
    expect(c?.count).toBeLessThanOrEqual(MONUMENT_ROOMS.corridor.maxCount);
  });
});
