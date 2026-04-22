import { describe, it, expect } from 'vitest';
import { onDeposit, shear, bottle, BEEHIVE_FULL_LEVEL } from './beehive_honey_level';

describe('beehive honey level', () => {
  it('deposit increments', () => {
    expect(onDeposit({ honeyLevel: 2, campfireBelow: false }).honeyLevel).toBe(3);
  });

  it('deposit caps at 5', () => {
    expect(onDeposit({ honeyLevel: 5, campfireBelow: false }).honeyLevel).toBe(5);
  });

  it('shear early not ready', () => {
    const r = shear({ honeyLevel: 3, campfireBelow: false });
    expect(r.result.kind).toBe('not_ready');
  });

  it('shear full gives honeycomb + resets + angers', () => {
    const r = shear({ honeyLevel: 5, campfireBelow: false });
    expect(r.result.kind).toBe('honeycomb');
    if (r.result.kind === 'honeycomb') {
      expect(r.result.count).toBe(3);
      expect(r.result.angered).toBe(true);
    }
    expect(r.hive.honeyLevel).toBe(0);
  });

  it('campfire below prevents anger', () => {
    const r = shear({ honeyLevel: 5, campfireBelow: true });
    if (r.result.kind === 'honeycomb') expect(r.result.angered).toBe(false);
  });

  it('bottle full gives honey', () => {
    const r = bottle({ honeyLevel: 5, campfireBelow: true });
    expect(r.result.kind).toBe('honey_bottle');
  });

  it('full level constant', () => {
    expect(BEEHIVE_FULL_LEVEL).toBe(5);
  });
});
