import { describe, it, expect } from 'vitest';
import { explodesOnUse, chargeCost, EXPLOSION_RADIUS } from './respawn_anchor_explode';

describe('respawn anchor explode', () => {
  it('overworld sleep trigger', () => {
    expect(explodesOnUse({ dim: 'overworld', charges: 1, playerTryingToSleep: true })).toBe(true);
  });

  it('nether never', () => {
    expect(explodesOnUse({ dim: 'nether', charges: 4, playerTryingToSleep: true })).toBe(false);
  });

  it('no charge no boom', () => {
    expect(explodesOnUse({ dim: 'end', charges: 0, playerTryingToSleep: true })).toBe(false);
  });

  it('charge cost 1', () => {
    expect(chargeCost()).toBe(1);
  });

  it('radius 5', () => {
    expect(EXPLOSION_RADIUS).toBe(5);
  });
});
