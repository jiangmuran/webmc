import { describe, it, expect } from 'vitest';
import { decayOneDay, reputationScoreFor } from './villager_gossip_spread';

describe('villager gossip spread', () => {
  it('curing positive outweighs minor negative', () => {
    const score = reputationScoreFor(
      [
        { about: 'p', kind: 'major_positive', weight: 10 },
        { about: 'p', kind: 'minor_negative', weight: 5 },
      ],
      'p',
    );
    expect(score).toBeGreaterThan(0);
  });

  it('decay drops weight', () => {
    const g = decayOneDay([{ about: 'p', kind: 'trading', weight: 5 }]);
    expect(g[0]?.weight).toBe(3);
  });

  it('zero weight pruned', () => {
    const g = decayOneDay([{ about: 'p', kind: 'trading', weight: 1 }]);
    expect(g).toHaveLength(0);
  });
});
