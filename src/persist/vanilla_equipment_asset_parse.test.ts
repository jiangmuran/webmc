import { describe, it, expect } from 'vitest';
import {
  parseVanillaEquipmentAsset,
  EquipmentAssetParseError,
} from './vanilla_equipment_asset_parse';

describe('vanilla equipment_asset parser', () => {
  it('parses a typical diamond armor asset', () => {
    const e = parseVanillaEquipmentAsset(
      JSON.stringify({
        layers: {
          humanoid: [{ texture: 'minecraft:diamond' }],
          humanoid_leggings: [{ texture: 'minecraft:diamond' }],
        },
      }),
    );
    expect(e.layers.humanoid?.[0]?.texture).toBe('webmc:diamond');
    expect(e.layers.humanoid_leggings?.[0]?.dyeable).toBe(false);
  });

  it('honors dyeable: true', () => {
    const e = parseVanillaEquipmentAsset(
      JSON.stringify({
        layers: {
          humanoid: [{ texture: 'minecraft:leather', dyeable: true }],
        },
      }),
    );
    expect(e.layers.humanoid?.[0]?.dyeable).toBe(true);
  });

  it('reads wolf_body and horse_body layer keys', () => {
    const e = parseVanillaEquipmentAsset(
      JSON.stringify({
        layers: {
          wolf_body: [{ texture: 'minecraft:wolf_armor' }],
          horse_body: [{ texture: 'minecraft:diamond_horse' }],
        },
      }),
    );
    expect(e.layers.wolf_body?.[0]?.texture).toBe('webmc:wolf_armor');
    expect(e.layers.horse_body?.[0]?.texture).toBe('webmc:diamond_horse');
  });

  it('falls back when layers missing', () => {
    expect(parseVanillaEquipmentAsset('{}').layers).toEqual({});
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaEquipmentAsset('nope')).toThrow(EquipmentAssetParseError);
  });
});
