import { describe, it, expect } from 'vitest';
import { shouldApply } from './pvp_team_damage';

describe('pvp team damage', () => {
  const team = { id: 'red', allowFriendlyFire: false, members: new Set(['a', 'b']) };

  it('enemies get damaged', () => {
    expect(shouldApply({ attackerId: 'x', targetId: 'y', teams: [team], pvpGlobal: true })).toBe(
      true,
    );
  });

  it('teammates with FF off = no damage', () => {
    expect(shouldApply({ attackerId: 'a', targetId: 'b', teams: [team], pvpGlobal: true })).toBe(
      false,
    );
  });

  it('teammates with FF on = damage', () => {
    const t = { ...team, allowFriendlyFire: true };
    expect(shouldApply({ attackerId: 'a', targetId: 'b', teams: [t], pvpGlobal: true })).toBe(true);
  });

  it('self damage always applies', () => {
    expect(shouldApply({ attackerId: 'a', targetId: 'a', teams: [team], pvpGlobal: true })).toBe(
      true,
    );
  });

  it('pvp off: env damage still applies', () => {
    expect(shouldApply({ attackerId: null, targetId: 'a', teams: [], pvpGlobal: false })).toBe(
      true,
    );
  });

  it('pvp off: player attack blocked', () => {
    expect(shouldApply({ attackerId: 'x', targetId: 'a', teams: [], pvpGlobal: false })).toBe(
      false,
    );
  });
});
