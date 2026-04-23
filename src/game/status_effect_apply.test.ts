import { describe, it, expect } from 'vitest';
import { makeEffects, apply, tick, has, level } from './status_effect_apply';

describe('status effect apply', () => {
  it('applies new', () => {
    const l = makeEffects();
    apply(l, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 100,
      isAmbient: false,
      showParticles: true,
    });
    expect(has(l, 'speed')).toBe(true);
  });

  it('higher amp upgrades', () => {
    const l = makeEffects();
    apply(l, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 100,
      isAmbient: false,
      showParticles: true,
    });
    apply(l, {
      id: 'speed',
      amplifier: 1,
      durationTicks: 50,
      isAmbient: false,
      showParticles: true,
    });
    expect(level(l, 'speed')).toBe(2);
  });

  it('same amp longer replaces', () => {
    const l = makeEffects();
    apply(l, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 100,
      isAmbient: false,
      showParticles: true,
    });
    apply(l, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 200,
      isAmbient: false,
      showParticles: true,
    });
    expect(l.byId.get('speed')?.durationTicks).toBe(200);
  });

  it('tick expires', () => {
    const l = makeEffects();
    apply(l, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 1,
      isAmbient: false,
      showParticles: true,
    });
    tick(l);
    expect(has(l, 'speed')).toBe(false);
  });

  it('level 0 when absent', () => {
    expect(level(makeEffects(), 'speed')).toBe(0);
  });
});
