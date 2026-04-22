import { describe, it, expect } from 'vitest';
import { growBush, harvestBush, makeBush, walkThroughDamage } from './sweet_berry';

describe('sweet berry bush', () => {
  it('grows stage by stage', () => {
    const b = makeBush();
    for (let i = 0; i < 1000 && b.stage < 3; i++) growBush(b, () => 0.01);
    expect(b.stage).toBe(3);
  });

  it("doesn't grow past stage 3", () => {
    const b = makeBush();
    b.stage = 3;
    expect(growBush(b, () => 0.01)).toBe(false);
  });

  it('stage 0 deals no damage', () => {
    const b = makeBush();
    expect(walkThroughDamage(b, true).damage).toBe(0);
  });

  it('moving through a grown bush damages', () => {
    const b = makeBush();
    b.stage = 2;
    const r = walkThroughDamage(b, true);
    expect(r.damage).toBeGreaterThan(0);
    expect(r.slownessSec).toBeGreaterThan(0);
  });

  it('harvest stage 3 returns 2-3 berries, resets to stage 1', () => {
    const b = makeBush();
    b.stage = 3;
    const drops = harvestBush(b);
    expect(drops.length).toBeGreaterThanOrEqual(2);
    expect(b.stage).toBe(1);
  });
});
