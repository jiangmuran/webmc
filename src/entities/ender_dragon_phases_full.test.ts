import { describe, it, expect } from 'vitest';
import { shouldTransitionTo } from './ender_dragon_phases_full';

describe('ender dragon phases', () => {
  it('dying at 0 HP', () => {
    expect(
      shouldTransitionTo('holding_pattern', {
        hpPercent: 0,
        allCrystalsDestroyed: true,
        player_nearby: true,
      }),
    ).toBe('dying');
  });

  it('lands when safe', () => {
    expect(
      shouldTransitionTo('holding_pattern', {
        hpPercent: 1,
        allCrystalsDestroyed: true,
        player_nearby: true,
      }),
    ).toBe('land_on_portal');
  });

  it('takeoff when alone', () => {
    expect(
      shouldTransitionTo('sit_attacking', {
        hpPercent: 0.5,
        allCrystalsDestroyed: true,
        player_nearby: false,
      }),
    ).toBe('takeoff');
  });

  it('stays when no transition', () => {
    expect(
      shouldTransitionTo('strafe_player', {
        hpPercent: 1,
        allCrystalsDestroyed: false,
        player_nearby: true,
      }),
    ).toBeUndefined();
  });
});
