import { describe, it, expect } from 'vitest';
import {
  computeAttribute,
  combineModifiers,
  removeModifier,
  type Modifier,
} from './entity_attribute_modifier';

describe('entity attribute modifier', () => {
  it('no modifiers base value', () => {
    expect(computeAttribute(10, [])).toBe(10);
  });

  it('add_value directly adds', () => {
    expect(computeAttribute(10, [{ id: 'a', operation: 'add_value', value: 5 }])).toBe(15);
  });

  it('add_multiplied_base multiplies base plus adds', () => {
    expect(
      computeAttribute(10, [
        { id: 'a', operation: 'add_value', value: 2 },
        { id: 'b', operation: 'add_multiplied_base', value: 0.5 },
      ]),
    ).toBeCloseTo(18);
  });

  it('combine deduplicates by id', () => {
    const m: Modifier = { id: 'a', operation: 'add_value', value: 1 };
    expect(combineModifiers([m], m)).toHaveLength(1);
  });

  it('remove deletes matching', () => {
    const m: Modifier = { id: 'a', operation: 'add_value', value: 1 };
    expect(removeModifier([m], 'a')).toEqual([]);
  });

  it('add_multiplied_total stacks', () => {
    const v = computeAttribute(10, [
      { id: 'a', operation: 'add_multiplied_total', value: 0.2 },
      { id: 'b', operation: 'add_multiplied_total', value: 0.5 },
    ]);
    expect(v).toBeCloseTo(10 * 1.2 * 1.5);
  });
});
