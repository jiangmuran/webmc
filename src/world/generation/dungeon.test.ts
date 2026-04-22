import { describe, it, expect } from 'vitest';
import { DEFAULT_SPAWNER_CONFIG, planDungeon, rollDungeonLoot } from './dungeon';

describe('dungeon', () => {
  it('spawner is zombie at low roll', () => {
    expect(planDungeon({ rng: () => 0.1 }).spawner).toBe('zombie');
  });

  it('spawner is spider at high roll', () => {
    const seq = [0.9, 0.1];
    let idx = 0;
    const rng = (): number => seq[idx++] ?? 0;
    const d = planDungeon({ rng });
    expect(d.spawner).toBe('spider');
  });

  it('floor is 5x5', () => {
    const d = planDungeon({ rng: () => 0.5 });
    expect(d.floorSize).toEqual({ width: 5, depth: 5 });
  });

  it('loot at low roll = saddle', () => {
    expect(rollDungeonLoot(0.001)?.item).toBe('webmc:saddle');
  });

  it('spawner activation radius is 16', () => {
    expect(DEFAULT_SPAWNER_CONFIG.activationRadius).toBe(16);
  });

  it('spawner caps at 6 nearby mobs', () => {
    expect(DEFAULT_SPAWNER_CONFIG.maxNearbyMobs).toBe(6);
  });
});
