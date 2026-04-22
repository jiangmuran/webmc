import { describe, it, expect } from 'vitest';
import { applyLoomPattern, patternRequiresItem } from './loom';
import { makeBanner } from './banner';

describe('loom', () => {
  it('basic patterns need no item', () => {
    expect(patternRequiresItem('stripe_top')).toBe(false);
    expect(patternRequiresItem('cross')).toBe(false);
  });

  it('special patterns require a pattern item', () => {
    expect(patternRequiresItem('creeper')).toBe(true);
    expect(patternRequiresItem('skull')).toBe(true);
  });

  it('accepts a basic pattern without an item', () => {
    const b = makeBanner('white');
    const r = applyLoomPattern({
      banner: b,
      dye: 'red',
      pattern: 'stripe_top',
      patternItemPresent: false,
    });
    expect(r.accepted).toBe(true);
    expect(b.layers.length).toBe(1);
  });

  it('refuses a special pattern without the matching item', () => {
    const b = makeBanner('white');
    const r = applyLoomPattern({
      banner: b,
      dye: 'black',
      pattern: 'creeper',
      patternItemPresent: false,
    });
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe('missing_pattern_item');
  });

  it('refuses at 6 layers', () => {
    const b = makeBanner();
    for (let i = 0; i < 6; i++) b.layers.push({ pattern: 'stripe_top', color: 'white' });
    const r = applyLoomPattern({
      banner: b,
      dye: 'red',
      pattern: 'stripe_bottom',
      patternItemPresent: false,
    });
    expect(r.accepted).toBe(false);
  });
});
