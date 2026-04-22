import { describe, it, expect } from 'vitest';
import { VillageGossip } from './village_gossip';

describe('village gossip', () => {
  it('fresh reputation is 0', () => {
    const g = new VillageGossip();
    expect(g.reputation('alice')).toBe(0);
  });

  it('trading improves reputation', () => {
    const g = new VillageGossip();
    g.add('alice', 'trading', 10);
    expect(g.reputation('alice')).toBe(10);
  });

  it('major_negative sinks reputation', () => {
    const g = new VillageGossip();
    g.add('alice', 'major_negative', 20);
    expect(g.reputation('alice')).toBeLessThan(0);
  });

  it('per-kind caps clamp amounts', () => {
    const g = new VillageGossip();
    g.add('alice', 'trading', 1000);
    expect(g.reputation('alice')).toBeLessThanOrEqual(25);
  });

  it('priceModifier clamps between -30% and +20%', () => {
    const g = new VillageGossip();
    g.add('alice', 'major_positive', 100);
    expect(g.priceModifier('alice')).toBeLessThanOrEqual(0.2);
    g.add('alice', 'major_negative', 100);
    expect(g.priceModifier('alice')).toBeGreaterThanOrEqual(-0.3);
  });

  it('decay shrinks reputations toward 0', () => {
    const g = new VillageGossip();
    g.add('alice', 'trading', 10);
    g.decay();
    expect(g.reputation('alice')).toBe(9);
  });
});
