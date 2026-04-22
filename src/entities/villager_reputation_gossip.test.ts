import { describe, it, expect } from 'vitest';
import { addGossip, decayDay, reputation, type GossipByPlayer } from './villager_reputation_gossip';

describe('gossip', () => {
  it('trade adds small positive', () => {
    const m: GossipByPlayer = new Map();
    addGossip(m, 'Steve', 'trading');
    expect(reputation(m, 'Steve')).toBe(2);
  });

  it('capped per type', () => {
    const m: GossipByPlayer = new Map();
    for (let i = 0; i < 50; i++) addGossip(m, 'Steve', 'trading');
    expect(reputation(m, 'Steve')).toBe(25);
  });

  it('negatives subtract', () => {
    const m: GossipByPlayer = new Map();
    addGossip(m, 'Steve', 'minor_negative');
    expect(reputation(m, 'Steve')).toBeLessThan(0);
  });

  it('major positive weighted 5x', () => {
    const m: GossipByPlayer = new Map();
    addGossip(m, 'Steve', 'major_positive');
    expect(reputation(m, 'Steve')).toBe(100); // 20 * 5
  });

  it('decay lowers values', () => {
    const m: GossipByPlayer = new Map();
    addGossip(m, 'Steve', 'trading');
    const before = reputation(m, 'Steve');
    decayDay(m);
    expect(reputation(m, 'Steve')).toBeLessThan(before);
  });
});
