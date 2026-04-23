import { describe, it, expect } from 'vitest';
import { potionToDrink, attackDamageMultiplierWhileDrinking } from './witch_heal_drink';

describe('witch heal drink', () => {
  it('low HP drinks healing', () => {
    expect(
      potionToDrink({
        hpPercent: 0.3,
        targetIsClose: true,
        fireDamageTicks: 0,
        insideWater: false,
        isDrinking: false,
      }),
    ).toBe('healing');
  });

  it('fire → fire resist', () => {
    expect(
      potionToDrink({
        hpPercent: 1,
        targetIsClose: true,
        fireDamageTicks: 10,
        insideWater: false,
        isDrinking: false,
      }),
    ).toBe('fire_resistance');
  });

  it('far target → swiftness', () => {
    expect(
      potionToDrink({
        hpPercent: 1,
        targetIsClose: false,
        fireDamageTicks: 0,
        insideWater: false,
        isDrinking: false,
      }),
    ).toBe('swiftness');
  });

  it('already drinking → none', () => {
    expect(
      potionToDrink({
        hpPercent: 0.1,
        targetIsClose: true,
        fireDamageTicks: 0,
        insideWater: false,
        isDrinking: true,
      }),
    ).toBe('none');
  });

  it('drinking lowers damage', () => {
    expect(attackDamageMultiplierWhileDrinking()).toBeLessThan(1);
  });
});
