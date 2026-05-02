import { describe, it, expect } from 'vitest';
import { dropsOnBreak, shatters } from './glass_break_silk';

describe('glass break silk', () => {
  it('silk touch keeps glass', () => {
    expect(dropsOnBreak({ silkTouch: true, block: 'glass' })).toBe('glass');
  });

  it('no silk shatters', () => {
    expect(dropsOnBreak({ silkTouch: false, block: 'glass' })).toBeUndefined();
    expect(shatters({ silkTouch: false, block: 'glass' })).toBe(true);
  });

  it('stained preserved with silk', () => {
    expect(dropsOnBreak({ silkTouch: true, block: 'red_stained_glass' })).toBe('red_stained_glass');
  });

  it('tinted glass drops itself without silk (wiki: special case)', () => {
    // Wiki (minecraft.wiki/w/Tinted_Glass): "Tinted glass drops as
    // an item when broken with any tool or by hand, unlike other
    // glass." (MC-206388 confirms WAI.)
    expect(dropsOnBreak({ silkTouch: false, block: 'tinted_glass' })).toBe('tinted_glass');
    expect(dropsOnBreak({ silkTouch: true, block: 'tinted_glass' })).toBe('tinted_glass');
    expect(shatters({ silkTouch: false, block: 'tinted_glass' })).toBe(false);
  });
});
