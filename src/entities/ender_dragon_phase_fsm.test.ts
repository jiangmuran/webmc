import { describe, it, expect } from 'vitest';
import { pickNextPhase, healthRegenPerTick, type DragonState } from './ender_dragon_phase_fsm';

const base: DragonState = {
  phase: 'holding_pattern',
  health: 200,
  maxHealth: 200,
  ticksInPhase: 0,
  crystalsAlive: 5,
};

describe('ender dragon phase FSM', () => {
  it('zero HP → dying', () => {
    expect(pickNextPhase({ ...base, health: 0 })).toBe('dying');
  });

  it('holding engages when player present', () => {
    const p = pickNextPhase({
      ...base,
      ticksInPhase: 200,
      engagedPlayer: 'alice',
    });
    expect(['strafe_player', 'landing_approach']).toContain(p);
  });

  it('landed → breath attack', () => {
    expect(pickNextPhase({ ...base, phase: 'landed', ticksInPhase: 300 })).toBe('breath_attack');
  });

  it('crystals regen HP', () => {
    expect(healthRegenPerTick({ ...base, health: 100 })).toBeGreaterThan(0);
  });

  it('full hp no regen', () => {
    expect(healthRegenPerTick({ ...base, health: base.maxHealth })).toBe(0);
  });

  it('no crystals no regen', () => {
    expect(healthRegenPerTick({ ...base, health: 100, crystalsAlive: 0 })).toBe(0);
  });
});
