import { describe, it, expect } from 'vitest';
import { emitsLight, prismarineCrystalsDropped, silkTouchDropsSelf } from './sea_lantern_light';

describe('sea lantern', () => {
  it('light 15', () => {
    expect(emitsLight()).toBe(15);
  });

  it('drops 2-4 crystals', () => {
    const d = prismarineCrystalsDropped(() => 0.5);
    expect(d).toBeGreaterThanOrEqual(2);
    expect(d).toBeLessThanOrEqual(4);
  });

  it('silk touch self-drop', () => {
    expect(silkTouchDropsSelf()).toBe(true);
  });
});
