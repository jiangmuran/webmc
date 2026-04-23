import { describe, it, expect } from 'vitest';
import {
  canRespawnAt,
  consumeCharge,
  charge,
  explodesOnUse,
  MAX_CHARGES,
} from './respawn_anchor_nether_only';

describe('respawn anchor nether-only', () => {
  it('charged in nether respawns', () => {
    expect(canRespawnAt({ charges: 1 }, 'nether')).toBe(true);
  });

  it('overworld never respawns', () => {
    expect(canRespawnAt({ charges: 4 }, 'overworld')).toBe(false);
  });

  it('end never respawns', () => {
    expect(canRespawnAt({ charges: 4 }, 'end')).toBe(false);
  });

  it('consume drops a charge', () => {
    expect(consumeCharge({ charges: 3 }).charges).toBe(2);
  });

  it('charge caps', () => {
    expect(charge({ charges: MAX_CHARGES }).charges).toBe(MAX_CHARGES);
  });

  it('explodes on overworld use', () => {
    expect(explodesOnUse({ charges: 1 }, 'overworld')).toBe(true);
  });

  it('does not explode in nether', () => {
    expect(explodesOnUse({ charges: 1 }, 'nether')).toBe(false);
  });
});
