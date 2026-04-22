import { describe, it, expect } from 'vitest';
import { encodeHeader, decodeHeader, CURRENT_CHUNK_SCHEMA } from './chunk_saved_blob';

describe('chunk save header', () => {
  it('round-trip', () => {
    const h = {
      schemaVersion: CURRENT_CHUNK_SCHEMA,
      cx: -100,
      cz: 37,
      paletteLength: 42,
      packedDataLength: 8192,
      skyLightLength: 2048,
      blockLightLength: 2048,
      biomeLength: 256,
      blockEntityCount: 3,
      scheduledTickCount: 5,
    };
    const buf = encodeHeader(h);
    expect(decodeHeader(buf)).toEqual(h);
  });

  it('buffer is 48 bytes', () => {
    const buf = encodeHeader({
      schemaVersion: 1,
      cx: 0,
      cz: 0,
      paletteLength: 0,
      packedDataLength: 0,
      skyLightLength: 0,
      blockLightLength: 0,
      biomeLength: 0,
      blockEntityCount: 0,
      scheduledTickCount: 0,
    });
    expect(buf.length).toBe(48);
  });

  it('negative chunk coords', () => {
    const h = {
      schemaVersion: 1,
      cx: -99999,
      cz: -1,
      paletteLength: 0,
      packedDataLength: 0,
      skyLightLength: 0,
      blockLightLength: 0,
      biomeLength: 0,
      blockEntityCount: 0,
      scheduledTickCount: 0,
    };
    expect(decodeHeader(encodeHeader(h)).cx).toBe(-99999);
  });
});
