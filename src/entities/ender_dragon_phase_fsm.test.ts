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

  it('crystals regen 0.1 HP/tick (wiki: 1 HP each half-second)', () => {
    // Wiki minecraft.wiki/w/End_Crystal#Healing_the_ender_dragon:
    // "The dragon is healed 1 HP each half-second" — 0.1 HP/tick.
    expect(healthRegenPerTick({ ...base, health: 100 })).toBeCloseTo(0.1);
  });

  it('regen rate is fixed, not crystal-count scaled (wiki)', () => {
    // 1 crystal alive vs 5 crystals alive — both should regen the
    // same 0.1 HP/tick (heal comes from nearest active crystal).
    expect(healthRegenPerTick({ ...base, health: 100, crystalsAlive: 1 })).toBeCloseTo(0.1);
    expect(healthRegenPerTick({ ...base, health: 100, crystalsAlive: 5 })).toBeCloseTo(0.1);
  });

  it('full hp no regen', () => {
    expect(healthRegenPerTick({ ...base, health: base.maxHealth })).toBe(0);
  });

  it('no crystals no regen', () => {
    expect(healthRegenPerTick({ ...base, health: 100, crystalsAlive: 0 })).toBe(0);
  });
});
