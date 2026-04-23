import { describe, it, expect } from 'vitest';
import {
  addGossip,
  reputationTowards,
  decay,
  MAX_VALUE,
  type VillagerGossip,
} from './gossip_spread';

function mk(): VillagerGossip {
  return { entries: [] };
}

describe('gossip spread', () => {
  it('add + sum rep', () => {
    const v = mk();
    addGossip(v, 'minor_positive', 'alice', 10);
    expect(reputationTowards(v, 'alice')).toBe(10);
  });

  it('caps at MAX_VALUE', () => {
    const v = mk();
    addGossip(v, 'major_positive', 'alice', 1000);
    expect(v.entries[0]?.value).toBe(MAX_VALUE.major_positive);
  });

  it('negatives subtract', () => {
    const v = mk();
    addGossip(v, 'major_negative', 'alice', 10);
    expect(reputationTowards(v, 'alice')).toBe(-50);
  });

  it('decay drops to 0', () => {
    const v = mk();
    addGossip(v, 'minor_positive', 'alice', 5);
    decay(v, 10);
    expect(v.entries.length).toBe(0);
  });

  it('filters by target', () => {
    const v = mk();
    addGossip(v, 'minor_positive', 'alice', 10);
    addGossip(v, 'minor_negative', 'bob', 10);
    expect(reputationTowards(v, 'alice')).toBe(10);
    expect(reputationTowards(v, 'bob')).toBe(-10);
  });
});
