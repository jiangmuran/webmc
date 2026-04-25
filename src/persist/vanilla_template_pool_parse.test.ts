import { describe, it, expect } from 'vitest';
import { parseVanillaTemplatePool, TemplatePoolParseError } from './vanilla_template_pool_parse';

describe('vanilla template_pool parser', () => {
  it('parses a typical village house pool', () => {
    const p = parseVanillaTemplatePool(
      JSON.stringify({
        name: 'minecraft:village/plains/houses',
        fallback: 'minecraft:empty',
        elements: [
          {
            weight: 5,
            element: {
              element_type: 'minecraft:single_pool_element',
              location: 'minecraft:village/plains/houses/house1',
              projection: 'rigid',
            },
          },
          {
            weight: 2,
            element: {
              element_type: 'minecraft:single_pool_element',
              location: 'minecraft:village/plains/houses/house2',
              projection: 'terrain_matching',
            },
          },
        ],
      }),
    );
    expect(p.name).toBe('webmc:village/plains/houses');
    expect(p.fallback).toBe('webmc:empty');
    expect(p.elements).toHaveLength(2);
    expect(p.elements[0]?.weight).toBe(5);
    expect(p.elements[0]?.elementType).toBe('webmc:single_pool_element');
    expect(p.elements[0]?.location).toBe('webmc:village/plains/houses/house1');
    expect(p.elements[1]?.projection).toBe('terrain_matching');
  });

  it('falls back to defaults for missing/empty pool', () => {
    const p = parseVanillaTemplatePool('{}');
    expect(p.name).toBe('');
    expect(p.fallback).toBe('');
    expect(p.elements).toEqual([]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaTemplatePool('nope')).toThrow(TemplatePoolParseError);
  });
});
