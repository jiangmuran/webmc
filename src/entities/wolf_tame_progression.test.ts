import { describe, it, expect } from 'vitest';
import { feedBone, toggleSit, canBreedWolves, TAME_CHANCE_PER_BONE } from './wolf_tame_progression';

describe('wolf taming', () => {
  it('bone with low roll tames', () => {
    const r = feedBone({ hostile: false, angerTicks: 0 }, { playerId: 'Steve', rand: () => 0 });
    expect(r.tamed).toBe(true);
    expect(r.newWolf?.ownerId).toBe('Steve');
  });

  it('high roll fails', () => {
    expect(
      feedBone(
        { hostile: false, angerTicks: 0 },
        { playerId: 'Steve', rand: () => TAME_CHANCE_PER_BONE + 0.01 },
      ).tamed,
    ).toBe(false);
  });

  it('sit toggles', () => {
    const w = { ownerId: 'S', sitting: false, collarColor: 'red' };
    toggleSit(w);
    expect(w.sitting).toBe(true);
    toggleSit(w);
    expect(w.sitting).toBe(false);
  });

  it('same-owner + fed = breed', () => {
    const a = { ownerId: 'S', sitting: false, collarColor: 'red' };
    const b = { ownerId: 'S', sitting: false, collarColor: 'red' };
    expect(canBreedWolves({ a, b, aFed: true, bFed: true })).toBe(true);
  });

  it('different owners CAN breed (wiki: random-owner offspring)', () => {
    const a = { ownerId: 'A', sitting: false, collarColor: 'red' };
    const b = { ownerId: 'B', sitting: false, collarColor: 'red' };
    expect(canBreedWolves({ a, b, aFed: true, bFed: true })).toBe(true);
  });

  it('sitting wolves cannot breed (wiki: must be standing)', () => {
    const a = { ownerId: 'S', sitting: true, collarColor: 'red' };
    const b = { ownerId: 'S', sitting: false, collarColor: 'red' };
    expect(canBreedWolves({ a, b, aFed: true, bFed: true })).toBe(false);
  });
});
