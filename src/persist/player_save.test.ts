import { describe, it, expect } from 'vitest';
import { canonicalize, freshPlayer, PLAYER_SAVE_VERSION, validatePlayerSave } from './player_save';

describe('player save', () => {
  it('fresh player has full health + hunger', () => {
    const p = freshPlayer('uuid1', 'alice');
    expect(p.health).toBe(20);
    expect(p.hunger).toBe(20);
  });

  it('fresh player passes validation', () => {
    expect(validatePlayerSave(freshPlayer('u', 'n'))).toEqual([]);
  });

  it('catches bad selected slot', () => {
    const p = freshPlayer('u', 'n');
    p.selectedSlot = 9;
    const errs = validatePlayerSave(p);
    expect(errs.some((e) => e.includes('selectedSlot'))).toBe(true);
  });

  it('catches duplicate slot', () => {
    const p = freshPlayer('u', 'n');
    p.inventory = [
      { slot: 0, item: 'webmc:dirt', count: 1, damage: 0 },
      { slot: 0, item: 'webmc:stone', count: 1, damage: 0 },
    ];
    expect(validatePlayerSave(p).some((e) => e.includes('duplicate'))).toBe(true);
  });

  it('canonicalize sorts inventory by slot', () => {
    const p = freshPlayer('u', 'n');
    p.inventory = [
      { slot: 3, item: 'webmc:a', count: 1, damage: 0 },
      { slot: 0, item: 'webmc:b', count: 1, damage: 0 },
    ];
    const c = canonicalize(p);
    expect(c.inventory[0]?.slot).toBe(0);
    expect(c.inventory[1]?.slot).toBe(3);
  });

  it('version is exported', () => {
    expect(PLAYER_SAVE_VERSION).toBe(3);
  });
});
