import { describe, it, expect } from 'vitest';
import {
  canCall,
  infestedBlocksBreakable,
  spawnsSilverfishOnBreak,
  CALL_MAX_SPAWNED,
} from './silverfish_call_reinforcements';

describe('silverfish call reinforcements', () => {
  it('angered low count calls', () => {
    expect(canCall({ centerX: 0, centerZ: 0, existingCount: 3, isAngered: true })).toBe(true);
  });

  it('not angered silent', () => {
    expect(canCall({ centerX: 0, centerZ: 0, existingCount: 0, isAngered: false })).toBe(false);
  });

  it('cap reached no more', () => {
    expect(
      canCall({ centerX: 0, centerZ: 0, existingCount: CALL_MAX_SPAWNED, isAngered: true }),
    ).toBe(false);
  });

  it('infested block detected', () => {
    expect(infestedBlocksBreakable('infested_stone')).toBe(true);
    expect(infestedBlocksBreakable('infested_deepslate')).toBe(true);
  });

  it('non-infested no silverfish', () => {
    expect(spawnsSilverfishOnBreak('stone')).toBe(false);
  });
});
