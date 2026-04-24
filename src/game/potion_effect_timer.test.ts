import { describe, it, expect } from 'vitest';
import { tickEffect, expired, merge, isBeneficial, type PotionEffect } from './potion_effect_timer';

const speed: PotionEffect = {
  id: 'speed',
  amplifier: 0,
  durationTicks: 100,
  ambient: false,
  showParticles: true,
};

describe('potion effect timer', () => {
  it('tick drains duration', () => {
    expect(tickEffect(speed).durationTicks).toBe(99);
  });

  it('expired at 0', () => {
    expect(expired({ ...speed, durationTicks: 0 })).toBe(true);
  });

  it('merge keeps higher amplifier', () => {
    const strong: PotionEffect = { ...speed, amplifier: 3, durationTicks: 10 };
    expect(merge(speed, strong)).toBe(strong);
  });

  it('merge prefers longer at same amplifier', () => {
    const longer: PotionEffect = { ...speed, durationTicks: 500 };
    expect(merge(speed, longer)).toBe(longer);
  });

  it('speed beneficial', () => {
    expect(isBeneficial('speed')).toBe(true);
  });

  it('poison not beneficial', () => {
    expect(isBeneficial('poison')).toBe(false);
  });
});
