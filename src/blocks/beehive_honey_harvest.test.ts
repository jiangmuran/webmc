import { describe, it, expect } from 'vitest';
import { harvest, pollinateTick, MAX_HONEY } from './beehive_honey_harvest';

describe('beehive harvest', () => {
  it('shears at full = 3 honeycomb', () => {
    const h = { honeyLevel: MAX_HONEY, beeCount: 0 };
    const r = harvest(h, { tool: 'shears', campfireBelow: false });
    expect(r.kind).toBe('ok');
    if (r.kind === 'ok') {
      expect(r.item).toBe('webmc:honeycomb');
      expect(r.count).toBe(3);
      expect(r.anger).toBe(true);
    }
    expect(h.honeyLevel).toBe(0);
  });

  it('campfire below prevents anger', () => {
    const h = { honeyLevel: MAX_HONEY, beeCount: 0 };
    const r = harvest(h, { tool: 'bottle', campfireBelow: true });
    if (r.kind === 'ok') expect(r.anger).toBe(false);
  });

  it('empty when not full', () => {
    const h = { honeyLevel: 3, beeCount: 0 };
    expect(harvest(h, { tool: 'shears', campfireBelow: false }).kind).toBe('empty');
  });

  it('no tool = no harvest', () => {
    const h = { honeyLevel: MAX_HONEY, beeCount: 0 };
    expect(harvest(h, { tool: 'none', campfireBelow: false }).kind).toBe('empty');
  });

  it('pollinate increments, caps', () => {
    const h = { honeyLevel: 4, beeCount: 1 };
    expect(pollinateTick(h)).toBe(true);
    expect(pollinateTick(h)).toBe(false);
    expect(h.honeyLevel).toBe(MAX_HONEY);
  });
});
