import { describe, it, expect } from 'vitest';
import {
  enchantedGoldenAppleEffects,
  regularGoldenAppleEffects,
} from './enchanted_golden_apple_buffs';

describe('golden apple buffs', () => {
  it('enchanted has resistance', () => {
    const ids = enchantedGoldenAppleEffects().map((e) => e.id);
    expect(ids).toContain('resistance');
    expect(ids).toContain('fire_resistance');
  });

  it('regular only two effects', () => {
    expect(regularGoldenAppleEffects()).toHaveLength(2);
  });

  it('enchanted has stronger absorption', () => {
    const enc = enchantedGoldenAppleEffects().find((e) => e.id === 'absorption');
    const plain = regularGoldenAppleEffects().find((e) => e.id === 'absorption');
    expect(enc?.level ?? 0).toBeGreaterThan(plain?.level ?? 0);
  });

  it('longer regen on enchanted', () => {
    const enc = enchantedGoldenAppleEffects().find((e) => e.id === 'regeneration');
    const plain = regularGoldenAppleEffects().find((e) => e.id === 'regeneration');
    expect(enc?.durationTicks ?? 0).toBeGreaterThan(plain?.durationTicks ?? 0);
  });
});
