import { describe, it, expect } from 'vitest';
import {
  pickPhase,
  damageMultiplier,
  projectileImmuneIfArmored,
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

  it('armored: projectile=0, melee=1 (wiki)', () => {
    // Wiki: wither armor blocks projectiles only, melee still works.
    expect(damageMultiplier({ ...base, phase: 'armored' }, 'projectile')).toBe(0);
    expect(damageMultiplier({ ...base, phase: 'armored' }, 'melee')).toBe(1);
  });

  it('armored projectile-immune, not melee (wiki)', () => {
    // Wiki: "immune to projectiles below half health" — melee lands.
    expect(projectileImmuneIfArmored({ ...base, phase: 'armored' })).toBe(true);
    expect(projectileImmuneIfArmored({ ...base, phase: 'regular' })).toBe(false);
  });

  it('summoning end explosion', () => {
    expect(
      initialExplosionRadius({ ...base, phase: 'summoning', ticksInPhase: SUMMONING_TICKS }),
    ).toBeGreaterThan(0);
  });
});
