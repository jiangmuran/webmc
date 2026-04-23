import { describe, it, expect } from 'vitest';
import { dropsXp } from './xp_drop_on_death';

describe('xp drop on death', () => {
  it('zombie drops 5', () => {
    expect(dropsXp({ type: 'zombie', lastHitByPlayerTicks: 10 })).toBe(5);
  });

  it('dragon drops a lot', () => {
    expect(dropsXp({ type: 'ender_dragon', lastHitByPlayerTicks: 0 })).toBe(12000);
  });

  it('baby villager 0', () => {
    expect(dropsXp({ type: 'villager', lastHitByPlayerTicks: 0 })).toBe(0);
  });

  it('no player kill no xp', () => {
    expect(dropsXp({ type: 'zombie' })).toBe(0);
  });

  it('old hit doesn’t count', () => {
    expect(dropsXp({ type: 'zombie', lastHitByPlayerTicks: 500 })).toBe(0);
  });
});
