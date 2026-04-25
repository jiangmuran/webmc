import { describe, it, expect } from 'vitest';
import {
  parseVanillaDensityFunction,
  DensityFunctionParseError,
} from './vanilla_density_function_parse';

describe('vanilla density_function parser', () => {
  it('parses a constant number', () => {
    const d = parseVanillaDensityFunction('1.5');
    expect(d.type).toBe('');
    expect(d.constant).toBe(1.5);
    expect(d.referencedTypes).toEqual([]);
  });

  it('extracts root type and nested referenced types', () => {
    const d = parseVanillaDensityFunction(
      JSON.stringify({
        type: 'minecraft:add',
        argument1: { type: 'minecraft:noise', noise: 'minecraft:continentalness' },
        argument2: { type: 'minecraft:constant', argument: 0.1 },
      }),
    );
    expect(d.type).toBe('webmc:add');
    expect(d.referencedTypes).toEqual(['webmc:add', 'webmc:constant', 'webmc:noise']);
  });

  it('handles deeply nested arrays', () => {
    const d = parseVanillaDensityFunction(
      JSON.stringify({
        type: 'minecraft:cache_2d',
        argument: {
          type: 'minecraft:max',
          argument1: { type: 'minecraft:abs', argument: { type: 'minecraft:y_clamped' } },
          argument2: 0,
        },
      }),
    );
    expect(d.referencedTypes).toContain('webmc:cache_2d');
    expect(d.referencedTypes).toContain('webmc:max');
    expect(d.referencedTypes).toContain('webmc:abs');
    expect(d.referencedTypes).toContain('webmc:y_clamped');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaDensityFunction('nope')).toThrow(DensityFunctionParseError);
  });
});
