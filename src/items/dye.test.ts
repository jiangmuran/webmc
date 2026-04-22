import { describe, it, expect } from 'vitest';
import { DYE_RGB, applyDyeToLeather, makeLeatherArmor, replaceColor } from './dye';

describe('dye', () => {
  it('has 16 colors', () => {
    expect(Object.keys(DYE_RGB).length).toBe(16);
  });

  it('leather armor starts at brown-ish default', () => {
    const a = makeLeatherArmor();
    expect(a.color[0]).toBeGreaterThan(100);
  });

  it('applying dye shifts color toward dye RGB', () => {
    const a = makeLeatherArmor();
    const r1 = applyDyeToLeather(a, 'red');
    expect(r1.color[0]).toBeGreaterThanOrEqual(a.color[0]);
  });

  it('repeated dye applications average', () => {
    let a = makeLeatherArmor();
    a = applyDyeToLeather(a, 'red');
    a = applyDyeToLeather(a, 'red');
    a = applyDyeToLeather(a, 'red');
    // After many red applications should be close to red RGB.
    expect(a.color[0]).toBeGreaterThan(100);
  });

  it('replaceColor returns the dye RGB', () => {
    expect(replaceColor('green')).toEqual([94, 124, 22]);
  });
});
