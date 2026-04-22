import { describe, it, expect } from 'vitest';
import {
  boltExpired,
  LIGHTNING_DAMAGE,
  LIGHTNING_LIFETIME_TICKS,
  onLightningStrike,
} from './pig_lightning';

describe('lightning conversions', () => {
  it('pig → zombified piglin', () => {
    expect(onLightningStrike('pig', 1).newKind).toBe('zombified_piglin');
  });

  it('villager → witch', () => {
    expect(onLightningStrike('villager', 2).newKind).toBe('witch');
  });

  it('mooshroom color swap', () => {
    expect(onLightningStrike('mooshroom_red', 2).newKind).toBe('mooshroom_brown');
    expect(onLightningStrike('mooshroom_brown', 2).newKind).toBe('mooshroom_red');
  });

  it('far bolt does not convert', () => {
    expect(onLightningStrike('pig', 10).converted).toBe(false);
  });

  it('cow does not convert', () => {
    expect(onLightningStrike('cow', 1).converted).toBe(false);
  });

  it('damage + lifetime constants', () => {
    expect(LIGHTNING_DAMAGE).toBe(5);
    expect(LIGHTNING_LIFETIME_TICKS).toBe(10);
  });

  it('boltExpired after lifetime', () => {
    expect(boltExpired({ x: 0, y: 0, z: 0, ageTicks: 10, visualOnly: false })).toBe(true);
    expect(boltExpired({ x: 0, y: 0, z: 0, ageTicks: 5, visualOnly: false })).toBe(false);
  });
});
