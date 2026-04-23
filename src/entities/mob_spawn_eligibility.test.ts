import { describe, it, expect } from 'vitest';
import {
  monsterSpawnable,
  passiveSpawnable,
  waterSpawnable,
  ambientSpawnable,
  type SpawnConditions,
} from './mob_spawn_eligibility';

const dark: SpawnConditions = {
  category: 'monster',
  skyLight: 0,
  blockLight: 0,
  onSurface: 'stone',
  y: 30,
  isDaytime: false,
};

describe('mob spawn eligibility', () => {
  it('monster spawns in darkness', () => {
    expect(monsterSpawnable(dark)).toBe(true);
  });

  it('monster blocked by light', () => {
    expect(monsterSpawnable({ ...dark, blockLight: 8 })).toBe(false);
  });

  it('passive needs grass and daylight', () => {
    expect(
      passiveSpawnable({
        ...dark,
        category: 'creature',
        onSurface: 'grass_block',
        skyLight: 15,
        isDaytime: true,
      }),
    ).toBe(true);
  });

  it('no passive on stone', () => {
    expect(passiveSpawnable({ ...dark, category: 'creature', skyLight: 15, isDaytime: true })).toBe(
      false,
    );
  });

  it('fish spawns in water', () => {
    expect(waterSpawnable({ ...dark, category: 'water_creature', onSurface: 'water' })).toBe(true);
  });

  it('bat spawns in cave', () => {
    expect(ambientSpawnable({ ...dark, category: 'ambient', y: 40 })).toBe(true);
  });
});
