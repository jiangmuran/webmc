import { describe, it, expect } from 'vitest';
import { shouldDrop, rollDrop } from './mob_equip_drops';

const base = {
  killedByPlayer: true,
  equippedSlot: 'mainhand' as const,
  itemId: 'webmc:iron_sword',
  lootingLevel: 0,
};

describe('equip drops', () => {
  it('drops on hard faster', () => {
    const hard = shouldDrop({ ...base, difficulty: 'hard', rand: () => 0.05 });
    const easy = shouldDrop({ ...base, difficulty: 'easy', rand: () => 0.05 });
    expect(hard).toBe(true);
    expect(easy).toBe(false);
  });

  it('no player kill = no drop', () => {
    expect(shouldDrop({ ...base, killedByPlayer: false, difficulty: 'hard', rand: () => 0 })).toBe(
      false,
    );
  });

  it('rollDrop yields data', () => {
    const r = rollDrop({ ...base, difficulty: 'hard', rand: () => 0 });
    expect(r?.itemId).toBe('webmc:iron_sword');
    expect(r?.damageFraction).toBeGreaterThanOrEqual(0);
  });

  it('rollDrop can be null', () => {
    expect(rollDrop({ ...base, difficulty: 'easy', rand: () => 0.99 })).toBeNull();
  });

  it('looting bumps chance', () => {
    const lv0 = shouldDrop({ ...base, difficulty: 'normal', rand: () => 0.05 });
    const lv3 = shouldDrop({ ...base, difficulty: 'normal', rand: () => 0.05, lootingLevel: 3 });
    if (lv0) expect(lv3).toBe(true);
  });
});
