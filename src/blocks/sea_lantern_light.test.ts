import { describe, it, expect } from 'vitest';
import { emitsLight, prismarineCrystalsDropped, silkTouchDropsSelf } from './sea_lantern_light';

describe('sea lantern', () => {
  it('light 15', () => {
    expect(emitsLight()).toBe(15);
  });

  it('drops 2-3 crystals (wiki)', () => {
    for (let i = 0; i < 100; i++) {
      const d = prismarineCrystalsDropped(() => i / 100);
      expect(d).toBeGreaterThanOrEqual(2);
      expect(d).toBeLessThanOrEqual(3);
    }
  });

  it('silk touch self-drop', () => {
    expect(silkTouchDropsSelf()).toBe(true);
  });
});
