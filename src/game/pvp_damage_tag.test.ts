import { describe, it, expect } from 'vitest';
import { inCombat, preventsLogout, attributeKillOnLogout, COMBAT_TAG_TICKS } from './pvp_damage_tag';

describe('pvp damage tag', () => {
  it('fresh tag in combat', () => {
    expect(inCombat({ taggedAtTick: 0, attackerId: 'a', currentTick: 50 })).toBe(true);
  });

  it('expired tag safe', () => {
    expect(
      inCombat({ taggedAtTick: 0, attackerId: 'a', currentTick: COMBAT_TAG_TICKS + 1 }),
    ).toBe(false);
  });

  it('prevent logout in combat', () => {
    expect(preventsLogout({ taggedAtTick: 0, attackerId: 'a', currentTick: 10 })).toBe(true);
  });

  it('attributes kill', () => {
    expect(
      attributeKillOnLogout({ taggedAtTick: 0, attackerId: 'bob', currentTick: 10 }),
    ).toBe('bob');
  });
});
