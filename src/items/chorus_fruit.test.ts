import { describe, it, expect } from 'vitest';
import { CHORUS_HUNGER_RESTORE, chorusFruitTeleport } from './chorus_fruit';

describe('chorus fruit', () => {
  it('teleports to a passable + supported location', () => {
    const target = chorusFruitTeleport(
      { x: 0, y: 64, z: 0 },
      {
        isPassable: () => true,
        hasSupport: () => true,
      },
      () => 0.9,
    );
    expect(target).not.toBeNull();
  });

  it('returns null when no passable spot after 16 attempts', () => {
    const target = chorusFruitTeleport(
      { x: 0, y: 64, z: 0 },
      {
        isPassable: () => false,
        hasSupport: () => true,
      },
    );
    expect(target).toBeNull();
  });

  it('respects the 8-block radius cap', () => {
    const target = chorusFruitTeleport(
      { x: 0, y: 64, z: 0 },
      {
        isPassable: () => true,
        hasSupport: () => true,
      },
    );
    if (!target) return;
    expect(Math.abs(target.x)).toBeLessThanOrEqual(8);
    expect(Math.abs(target.y - 64)).toBeLessThanOrEqual(8);
    expect(Math.abs(target.z)).toBeLessThanOrEqual(8);
  });

  it('nutrition constants set', () => {
    expect(CHORUS_HUNGER_RESTORE).toBe(4);
  });
});
