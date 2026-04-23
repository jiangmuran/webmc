import { describe, it, expect } from 'vitest';
import { modifiersFor, applyModifiers } from './effect_attribute_modifier';

describe('effect attribute modifier', () => {
  it('speed +20% per level', () => {
    expect(modifiersFor('speed', 1)[0]?.amount).toBeCloseTo(0.4);
  });

  it('strength +3/level', () => {
    expect(modifiersFor('strength', 0)[0]?.amount).toBe(3);
  });

  it('unknown empty', () => {
    expect(modifiersFor('mystery', 0)).toEqual([]);
  });

  it('applyModifiers order', () => {
    const v = applyModifiers(10, [
      { id: 'a', attribute: 'attack_damage', operation: 'add', amount: 5 },
      { id: 'b', attribute: 'attack_damage', operation: 'multiply_total', amount: 0.5 },
    ]);
    expect(v).toBe((10 + 5) * 1.5);
  });
});
