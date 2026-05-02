import { describe, it, expect } from 'vitest';
import { parseVanillaBlockstate, BlockstateParseError } from './vanilla_blockstate_parse';

describe('vanilla blockstate parser', () => {
  it('parses single-variant blockstate', () => {
    const b = parseVanillaBlockstate(
      JSON.stringify({
        variants: { '': { model: 'minecraft:block/stone' } },
      }),
    );
    expect(b.variants).toEqual([
      {
        key: '',
        models: [{ model: 'webmc:block/stone', x: 0, y: 0, uvlock: false, weight: 1 }],
      },
    ]);
    expect(b.multipart).toEqual([]);
  });

  it('parses keyed variants with rotation and uvlock', () => {
    const b = parseVanillaBlockstate(
      JSON.stringify({
        variants: {
          'facing=north': { model: 'minecraft:block/dispenser', x: 90 },
          'facing=east': { model: 'minecraft:block/dispenser', x: 90, y: 90, uvlock: true },
        },
      }),
    );
    const east = b.variants.find((v) => v.key === 'facing=east');
    expect(east?.models[0]).toEqual({
      model: 'webmc:block/dispenser',
      x: 90,
      y: 90,
      uvlock: true,
      weight: 1,
    });
  });

  it('parses array variants (random rotation)', () => {
    const b = parseVanillaBlockstate(
      JSON.stringify({
        variants: {
          '': [
            { model: 'minecraft:block/grass', y: 0 },
            { model: 'minecraft:block/grass', y: 90 },
            { model: 'minecraft:block/grass', y: 180, weight: 2 },
            { model: 'minecraft:block/grass', y: 270 },
          ],
        },
      }),
    );
    expect(b.variants[0]?.models.length).toBe(4);
    expect(b.variants[0]?.models[2]?.weight).toBe(2);
  });

  it('parses multipart with when conditions', () => {
    const b = parseVanillaBlockstate(
      JSON.stringify({
        multipart: [
          { apply: { model: 'minecraft:block/fence_post' } },
          { when: { north: 'true' }, apply: { model: 'minecraft:block/fence_side' } },
        ],
      }),
    );
    expect(b.multipart.length).toBe(2);
    expect(b.multipart[0]?.when).toEqual({});
    expect(b.multipart[1]?.when).toEqual({ north: 'true' });
    expect(b.multipart[1]?.apply[0]?.model).toBe('webmc:block/fence_side');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaBlockstate('nope')).toThrow(BlockstateParseError);
  });
});
