import { describe, it, expect } from 'vitest';
import {
  respawnLocation,
  droppedItemsCount,
  droppedXpOrbs,
  keepsInventory,
} from './respawn_on_death';

const base = {
  keepInventory: false,
  currentLevel: 10,
  currentXp: 0,
  bedValid: false,
  anchorValid: false,
  dimension: 'overworld',
};

describe('respawn on death', () => {
  it('no valid point → world spawn', () => {
    expect(respawnLocation(base).kind).toBe('world_spawn');
  });

  it('bed in overworld', () => {
    expect(respawnLocation({ ...base, bedValid: true }).kind).toBe('bed');
  });

  it('anchor in nether', () => {
    expect(respawnLocation({ ...base, anchorValid: true, dimension: 'nether' }).kind).toBe(
      'respawn_anchor',
    );
  });

  it('keepInventory drops nothing', () => {
    expect(droppedItemsCount({ ...base, keepInventory: true }, 100)).toBe(0);
    expect(droppedXpOrbs({ ...base, keepInventory: true })).toBe(0);
  });

  it('drops XP 7×level capped 100', () => {
    expect(droppedXpOrbs({ ...base, currentLevel: 5 })).toBe(35);
    expect(droppedXpOrbs({ ...base, currentLevel: 100 })).toBe(100);
  });

  it('keepsInventory passthrough', () => {
    expect(keepsInventory({ ...base, keepInventory: true })).toBe(true);
  });
});
