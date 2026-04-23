import { describe, it, expect } from 'vitest';
import {
  isHostileToPlayer,
  acceptsBarter,
  likedEquipment,
  dropsGoldIngotsOnKill,
} from './piglin_gold_armor';

describe('piglin gold armor', () => {
  it('gold armor pacifies', () => {
    expect(
      isHostileToPlayer({
        playerWearingGold: true,
        playerMinedGold: false,
        playerOpenedChest: false,
        playerAttackedPiglin: false,
      }),
    ).toBe(false);
  });

  it('naked player hostile', () => {
    expect(
      isHostileToPlayer({
        playerWearingGold: false,
        playerMinedGold: false,
        playerOpenedChest: false,
        playerAttackedPiglin: false,
      }),
    ).toBe(true);
  });

  it('mining gold angers even in armor', () => {
    expect(
      isHostileToPlayer({
        playerWearingGold: true,
        playerMinedGold: true,
        playerOpenedChest: false,
        playerAttackedPiglin: false,
      }),
    ).toBe(true);
  });

  it('barter accepts ingot only', () => {
    expect(acceptsBarter('gold_ingot')).toBe(true);
    expect(acceptsBarter('gold_nugget')).toBe(false);
  });

  it('likes golden armor', () => {
    expect(likedEquipment('golden_chestplate')).toBe(true);
  });

  it('drops gold ingots', () => {
    expect(dropsGoldIngotsOnKill()).toBe(true);
  });
});
