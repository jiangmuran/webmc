import { describe, it, expect } from 'vitest';
import { optionsFor, outputCountFor } from './stonecutter_single_input';

describe('stonecutter single input', () => {
  it('stone has multiple options', () => {
    expect(optionsFor('stone').length).toBeGreaterThan(1);
  });

  it('slab doubles', () => {
    expect(outputCountFor('stone', 'stone_slab')).toBe(2);
  });

  it('unknown combo 0', () => {
    expect(outputCountFor('stone', 'diamond')).toBe(0);
  });

  it('sandstone cut yields 4', () => {
    expect(outputCountFor('sandstone', 'cut_sandstone')).toBe(4);
  });
});
