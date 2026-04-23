import { describe, it, expect } from 'vitest';
import {
  canStartRespawn,
  advance,
  isComplete,
  CRYSTAL_PLACEMENT_OFFSETS,
  RESPAWN_SEQUENCE_TICKS,
} from './end_crystal_respawn';

describe('end crystal respawn', () => {
  it('needs 4 crystals + dead dragon', () => {
    expect(canStartRespawn({ crystalsPlaced: 4, dragonAlive: false })).toBe(true);
    expect(canStartRespawn({ crystalsPlaced: 3, dragonAlive: false })).toBe(false);
    expect(canStartRespawn({ crystalsPlaced: 4, dragonAlive: true })).toBe(false);
  });

  it('advance increments', () => {
    expect(advance({ ticksElapsed: 5, crystalsRegenerating: 4 }).ticksElapsed).toBe(6);
  });

  it('complete at threshold', () => {
    expect(isComplete({ ticksElapsed: RESPAWN_SEQUENCE_TICKS, crystalsRegenerating: 0 })).toBe(
      true,
    );
  });

  it('4 crystal offsets', () => {
    expect(CRYSTAL_PLACEMENT_OFFSETS.length).toBe(4);
  });
});
