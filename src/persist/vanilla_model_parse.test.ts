import { describe, it, expect } from 'vitest';
import { parseVanillaModel, ModelParseError } from './vanilla_model_parse';

describe('vanilla model parser', () => {
  it('parses a parent + textures model', () => {
    const m = parseVanillaModel(
      JSON.stringify({
        parent: 'minecraft:block/cube_all',
        textures: { all: 'minecraft:block/stone' },
      }),
    );
    expect(m.parent).toBe('webmc:block/cube_all');
    expect(m.textures['all']).toBe('webmc:block/stone');
    expect(m.elements).toEqual([]);
    expect(m.ambientOcclusion).toBe(true);
  });

  it('preserves # texture references unchanged', () => {
    const m = parseVanillaModel(
      JSON.stringify({
        parent: 'minecraft:block/cube',
        textures: { particle: '#all', all: 'minecraft:block/dirt' },
      }),
    );
    expect(m.textures['particle']).toBe('#all');
    expect(m.textures['all']).toBe('webmc:block/dirt');
  });

  it('parses elements with faces, uv, rotation, cullface', () => {
    const m = parseVanillaModel(
      JSON.stringify({
        elements: [
          {
            from: [0, 0, 0],
            to: [16, 16, 16],
            faces: {
              north: { texture: '#all', uv: [0, 0, 16, 16], rotation: 90, cullface: 'north' },
              up: { texture: '#all' },
            },
          },
        ],
      }),
    );
    expect(m.elements.length).toBe(1);
    expect(m.elements[0]?.from).toEqual([0, 0, 0]);
    expect(m.elements[0]?.to).toEqual([16, 16, 16]);
    expect(m.elements[0]?.faces.north?.rotation).toBe(90);
    expect(m.elements[0]?.faces.north?.cullface).toBe('north');
    expect(m.elements[0]?.faces.up?.uv).toBeNull();
  });

  it('falls back to defaults when fields missing', () => {
    const m = parseVanillaModel('{}');
    expect(m.parent).toBeNull();
    expect(m.textures).toEqual({});
    expect(m.elements).toEqual([]);
    expect(m.ambientOcclusion).toBe(true);
  });

  it('honors ambientocclusion: false', () => {
    const m = parseVanillaModel(JSON.stringify({ ambientocclusion: false }));
    expect(m.ambientOcclusion).toBe(false);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaModel('nope')).toThrow(ModelParseError);
  });
});
