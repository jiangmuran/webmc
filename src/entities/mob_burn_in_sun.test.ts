import { describe, it, expect } from 'vitest';
import { babyZombieSpeedMultiplier, evaluateSunBurn } from './mob_burn_in_sun';

const DEFAULT = {
  skyLight: 15,
  timeOfDay: 0.25,
  inWater: false,
  inShade: false,
  wearingHelmet: false,
  isBabyZombie: false,
};

describe('sun burn', () => {
  it('zombie at noon burns', () => {
    expect(evaluateSunBurn({ mob: 'zombie', ...DEFAULT }).shouldIgnite).toBe(true);
  });

  it('husk does not burn', () => {
    expect(evaluateSunBurn({ mob: 'husk', ...DEFAULT }).shouldIgnite).toBe(false);
  });

  it('zombified piglin does not burn', () => {
    expect(evaluateSunBurn({ mob: 'zombified_piglin', ...DEFAULT }).shouldIgnite).toBe(false);
  });

  it('helmet prevents burn but damages helmet', () => {
    const r = evaluateSunBurn({ mob: 'zombie', ...DEFAULT, wearingHelmet: true });
    expect(r.shouldIgnite).toBe(false);
    expect(r.helmetConsumesDurability).toBe(true);
  });

  it('water cancels burn', () => {
    expect(evaluateSunBurn({ mob: 'zombie', ...DEFAULT, inWater: true }).shouldIgnite).toBe(false);
  });

  it('shade cancels burn', () => {
    expect(evaluateSunBurn({ mob: 'zombie', ...DEFAULT, inShade: true }).shouldIgnite).toBe(false);
  });

  it('night no burn', () => {
    expect(evaluateSunBurn({ mob: 'zombie', ...DEFAULT, timeOfDay: 0.75 }).shouldIgnite).toBe(
      false,
    );
  });

  it('cow does not burn', () => {
    expect(evaluateSunBurn({ mob: 'cow', ...DEFAULT }).shouldIgnite).toBe(false);
  });

  it('baby zombie is 1.5× faster', () => {
    expect(babyZombieSpeedMultiplier(true)).toBe(1.5);
  });
});
