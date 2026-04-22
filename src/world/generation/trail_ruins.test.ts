import { describe, it, expect } from 'vitest';
import { drawTrailLoot, planTrailRuin } from './trail_ruins';

describe('trail ruins', () => {
  it('has at least one building', () => {
    const p = planTrailRuin({ rng: () => 0.5, depth: 3 });
    expect(p.buildings.length).toBeGreaterThanOrEqual(1);
  });

  it('sherd pool scales with suspicious count', () => {
    const p = planTrailRuin({ rng: () => 0.5, depth: 5 });
    expect(p.sherdPoolCount).toBeLessThanOrEqual(p.suspiciousGravelCount);
  });

  it('rare roll < 0.02 returns disc', () => {
    const l = drawTrailLoot(0.5, 0.01);
    expect(l.kind).toBe('disc');
  });

  it('rare roll 0.05 returns trim', () => {
    const l = drawTrailLoot(0.5, 0.05);
    expect(l.kind).toBe('trim');
  });

  it('low common roll returns a sherd', () => {
    const l = drawTrailLoot(0.1, 0.5);
    expect(l.kind).toBe('sherd');
  });

  it('high common roll returns a common item', () => {
    const l = drawTrailLoot(0.9, 0.5);
    expect(l.kind).toBe('common');
  });
});
