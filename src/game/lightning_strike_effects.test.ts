import { describe, it, expect } from 'vitest';
import {
  effectOnTarget,
  targetTransformation,
  LIGHTNING_DAMAGE,
  LIGHTNING_FIRE_RADIUS,
} from './lightning_strike_effects';

describe('lightning strike effects', () => {
  it('fire starts on hit', () => {
    expect(effectOnTarget('cow').ignitesFire).toBe(true);
  });

  it('creeper gets charged', () => {
    expect(effectOnTarget('creeper').chargesCreeper).toBe(true);
  });

  it('villager → witch', () => {
    expect(targetTransformation('villager')).toBe('witch');
  });

  it('pig → zombified piglin', () => {
    expect(targetTransformation('pig')).toBe('zombified_piglin');
  });

  it('mooshroom swap variant', () => {
    expect(targetTransformation('mooshroom')).toBe('brown_mooshroom');
  });

  it('regular mob no transform', () => {
    expect(targetTransformation('zombie')).toBeUndefined();
  });

  it('constants set', () => {
    expect(LIGHTNING_DAMAGE).toBe(5);
    expect(LIGHTNING_FIRE_RADIUS).toBe(4);
  });
});
