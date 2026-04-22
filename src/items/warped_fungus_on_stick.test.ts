import { describe, it, expect } from 'vitest';
import { use, craft, steersMob, FUNGUS_STICK_MAX } from './warped_fungus_on_stick';

describe('warped fungus on stick', () => {
  it('crafts at full durability', () => {
    expect(craft().durability).toBe(FUNGUS_STICK_MAX);
  });

  it('use consumes durability', () => {
    const s = craft();
    use(s, 0, 0);
    expect(s.durability).toBe(FUNGUS_STICK_MAX - 1);
  });

  it('zero durability returns null', () => {
    const s = { durability: 0, maxDurability: FUNGUS_STICK_MAX };
    expect(use(s, 0, 0)).toBeNull();
  });

  it('only steers strider', () => {
    expect(steersMob('strider')).toBe(true);
    expect(steersMob('pig')).toBe(false);
  });
});
