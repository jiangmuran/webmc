import { describe, it, expect } from 'vitest';
import { speedOnSoul, maybeWear, isBroken } from './soul_speed_boost';

describe('soul speed', () => {
  it('no enchant = 1', () => {
    expect(speedOnSoul({ soulSpeedLevel: 0, damage: 0, maxDurability: 100 })).toBe(1);
  });

  it('scales with level', () => {
    const l1 = speedOnSoul({ soulSpeedLevel: 1, damage: 0, maxDurability: 100 });
    const l3 = speedOnSoul({ soulSpeedLevel: 3, damage: 0, maxDurability: 100 });
    expect(l3).toBeGreaterThan(l1);
  });

  it('wear on soul block', () => {
    const b = { soulSpeedLevel: 2, damage: 0, maxDurability: 100 };
    expect(maybeWear(b, { onSoulBlock: true, rand: () => 0 })).toBe(1);
  });

  it('no wear off-soul', () => {
    const b = { soulSpeedLevel: 2, damage: 0, maxDurability: 100 };
    expect(maybeWear(b, { onSoulBlock: false, rand: () => 0 })).toBe(0);
  });

  it('broken detect', () => {
    expect(isBroken({ soulSpeedLevel: 2, damage: 100, maxDurability: 100 })).toBe(true);
  });
});
