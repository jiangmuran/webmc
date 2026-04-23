import { describe, it, expect } from 'vitest';
import {
  pickPhase,
  damageMultiplier,
  meleeImmuneIfArmored,
  initialExplosionRadius,
  SUMMONING_TICKS,
  type WitherState,
} from './wither_boss_phase';

const base: WitherState = {
  phase: 'regular',
  health: 300,
  maxHealth: 300,
  ticksInPhase: 0,
};

describe('wither boss phase', () => {
  it('half HP → armored', () => {
    expect(pickPhase({ ...base, health: 100 })).toBe('armored');
  });

  it('full HP → regular', () => {
    expect(pickPhase(base)).toBe('regular');
  });

  it('summoning still counting', () => {
    expect(pickPhase({ ...base, phase: 'summoning', ticksInPhase: 100 })).toBe('summoning');
  });

  it('zero HP dying', () => {
    expect(pickPhase({ ...base, health: 0 })).toBe('dying');
  });

  it('armored zero damage mult', () => {
    expect(damageMultiplier({ ...base, phase: 'armored' })).toBe(0);
  });

  it('armored melee immune', () => {
    expect(meleeImmuneIfArmored({ ...base, phase: 'armored' })).toBe(true);
  });

  it('summoning end explosion', () => {
    expect(
      initialExplosionRadius({ ...base, phase: 'summoning', ticksInPhase: SUMMONING_TICKS }),
    ).toBeGreaterThan(0);
  });
});
