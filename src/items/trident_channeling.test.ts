import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { tryChanneling } from './trident_channeling';

const plain: Enchanted = { itemId: 1, count: 1, damage: 0 };
const channeled = applyEnchant(plain, 'channeling', 1);

describe('trident channeling', () => {
  it('summons lightning during thunder + exposed victim', () => {
    expect(
      tryChanneling({
        trident: channeled,
        isThunderstorm: true,
        victimExposedToSky: true,
        hitLightningRod: false,
      }).summonsLightning,
    ).toBe(true);
  });

  it('lightning rod hit also counts', () => {
    expect(
      tryChanneling({
        trident: channeled,
        isThunderstorm: true,
        victimExposedToSky: false,
        hitLightningRod: true,
      }).summonsLightning,
    ).toBe(true);
  });

  it('no enchant → no lightning', () => {
    expect(
      tryChanneling({
        trident: plain,
        isThunderstorm: true,
        victimExposedToSky: true,
        hitLightningRod: false,
      }).summonsLightning,
    ).toBe(false);
  });

  it('no thunder → no lightning', () => {
    expect(
      tryChanneling({
        trident: channeled,
        isThunderstorm: false,
        victimExposedToSky: true,
        hitLightningRod: false,
      }).summonsLightning,
    ).toBe(false);
  });
});
