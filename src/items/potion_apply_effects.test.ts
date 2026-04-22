import { describe, it, expect } from 'vitest';
import { makeEffects, apply, tickEffects, isInstant } from './potion_apply_effects';

describe('potion effects', () => {
  it('instant vs timed', () => {
    expect(isInstant('instant_health')).toBe(true);
    expect(isInstant('speed')).toBe(false);
  });

  it('add a new effect', () => {
    const pe = makeEffects();
    expect(
      apply(pe, {
        id: 'speed',
        amplifier: 0,
        durationTicks: 200,
        ambient: false,
        showParticles: true,
      }),
    ).toBe('added');
    expect(pe.active.has('speed')).toBe(true);
  });

  it('higher amplifier upgrades', () => {
    const pe = makeEffects();
    apply(pe, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 200,
      ambient: false,
      showParticles: true,
    });
    expect(
      apply(pe, {
        id: 'speed',
        amplifier: 1,
        durationTicks: 100,
        ambient: false,
        showParticles: true,
      }),
    ).toBe('upgraded');
    expect(pe.active.get('speed')?.amplifier).toBe(1);
  });

  it('same amplifier merges duration', () => {
    const pe = makeEffects();
    apply(pe, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 100,
      ambient: false,
      showParticles: true,
    });
    apply(pe, {
      id: 'speed',
      amplifier: 0,
      durationTicks: 300,
      ambient: false,
      showParticles: true,
    });
    expect(pe.active.get('speed')?.durationTicks).toBe(300);
  });

  it('instant health delivered once', () => {
    const pe = makeEffects();
    apply(pe, {
      id: 'instant_health',
      amplifier: 0,
      durationTicks: 1,
      ambient: false,
      showParticles: true,
    });
    const r = tickEffects(pe);
    expect(r.instantHp).toBe(4);
    expect(pe.active.has('instant_health')).toBe(false);
  });

  it('timed expires', () => {
    const pe = makeEffects();
    apply(pe, { id: 'speed', amplifier: 0, durationTicks: 2, ambient: false, showParticles: true });
    tickEffects(pe);
    tickEffects(pe);
    expect(pe.active.has('speed')).toBe(false);
  });
});
