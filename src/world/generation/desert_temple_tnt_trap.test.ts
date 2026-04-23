import { describe, it, expect } from 'vitest';
import { triggers, lootChestCount, treasureRoomDepthY, TNT_COUNT } from './desert_temple_tnt_trap';

describe('desert temple tnt trap', () => {
  it('plate triggers', () => {
    expect(triggers({ pressurePlateActive: true, tntPrimed: false })).toBe(true);
  });

  it('inactive safe', () => {
    expect(triggers({ pressurePlateActive: false, tntPrimed: false })).toBe(false);
  });

  it('has chests', () => {
    expect(lootChestCount()).toBe(4);
  });

  it('9 TNT blocks', () => {
    expect(TNT_COUNT).toBe(9);
  });

  it('treasure below floor', () => {
    expect(treasureRoomDepthY()).toBeLessThan(0);
  });
});
