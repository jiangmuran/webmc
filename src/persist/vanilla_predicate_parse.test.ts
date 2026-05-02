import { describe, it, expect } from 'vitest';
import { parseVanillaPredicate, PredicateParseError } from './vanilla_predicate_parse';

describe('vanilla predicate parser', () => {
  it('parses a single condition object', () => {
    const ps = parseVanillaPredicate(
      JSON.stringify({
        condition: 'minecraft:entity_properties',
        entity: 'this',
        predicate: { type: 'minecraft:player' },
      }),
    );
    expect(ps).toHaveLength(1);
    expect(ps[0]?.type).toBe('webmc:entity_properties');
    expect(ps[0]?.raw['entity']).toBe('this');
  });

  it('parses an array of conditions', () => {
    const ps = parseVanillaPredicate(
      JSON.stringify([
        { condition: 'minecraft:random_chance', chance: 0.25 },
        { condition: 'minecraft:killed_by_player' },
      ]),
    );
    expect(ps).toHaveLength(2);
    expect(ps[0]?.type).toBe('webmc:random_chance');
    expect(ps[1]?.type).toBe('webmc:killed_by_player');
  });

  it('handles missing discriminator with empty type', () => {
    const ps = parseVanillaPredicate('{}');
    expect(ps[0]?.type).toBe('');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaPredicate('not json')).toThrow(PredicateParseError);
  });
});
