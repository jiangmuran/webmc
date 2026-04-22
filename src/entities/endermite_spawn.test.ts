import { describe, it, expect } from 'vitest';
import {
  spawnFromPearl,
  tickEndermite,
  enderman_attacks_endermite,
  SPAWN_CHANCE_FROM_PEARL,
  DESPAWN_TICKS,
  ATTRACT_RADIUS,
} from './endermite_spawn';

describe('endermite', () => {
  it('low roll spawns', () => {
    expect(spawnFromPearl({ rand: () => 0 })).toBe(true);
    expect(spawnFromPearl({ rand: () => SPAWN_CHANCE_FROM_PEARL + 0.01 })).toBe(false);
  });

  it('despawns after DESPAWN_TICKS', () => {
    const e = { ageTicks: DESPAWN_TICKS - 1, hp: 8 };
    expect(tickEndermite(e)).toBe(true);
  });

  it('enderman targets endermite in range', () => {
    expect(enderman_attacks_endermite(ATTRACT_RADIUS)).toBe(true);
    expect(enderman_attacks_endermite(ATTRACT_RADIUS + 1)).toBe(false);
  });
});
