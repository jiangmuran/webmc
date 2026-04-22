import { describe, it, expect } from 'vitest';
import { freezeVignetteFraction, isFreezeImmune, tickPowderSnow } from './powder_snow';

describe('powder snow', () => {
  it('leather boots prevent sinking', () => {
    const r = tickPowderSnow({ inPowderSnow: true, hasLeatherBoots: true, freezeTicks: 0 }, 5);
    expect(r.sinking).toBe(false);
  });

  it('no boots = sinking + freeze', () => {
    const r = tickPowderSnow({ inPowderSnow: true, hasLeatherBoots: false, freezeTicks: 0 }, 10);
    expect(r.sinking).toBe(true);
    expect(r.freezeTicks).toBe(10);
  });

  it('vignette fraction caps at 1 past max', () => {
    expect(freezeVignetteFraction(200)).toBe(1);
  });

  it('freeze damage at full + past interval', () => {
    const r = tickPowderSnow({ inPowderSnow: true, hasLeatherBoots: false, freezeTicks: 140 }, 40);
    expect(r.damage).toBeGreaterThan(0);
  });

  it('leaving snow decays freeze', () => {
    const r = tickPowderSnow({ inPowderSnow: false, hasLeatherBoots: false, freezeTicks: 50 }, 10);
    expect(r.freezeTicks).toBeLessThan(50);
  });

  it('blaze is immune', () => {
    expect(isFreezeImmune('blaze')).toBe(true);
  });

  it('zombie is not immune', () => {
    expect(isFreezeImmune('zombie')).toBe(false);
  });

  it('vignette at full = 1', () => {
    expect(freezeVignetteFraction(140)).toBe(1);
  });
});
