// Chunk save blob structure (v1). Single buffer holding palette,
// packed indices, light, biome, block entities, scheduled ticks.

export interface ChunkSaveHeader {
  schemaVersion: number;
  cx: number;
  cz: number;
  paletteLength: number;
  packedDataLength: number;
  skyLightLength: number;
  blockLightLength: number;
  biomeLength: number;
  blockEntityCount: number;
  scheduledTickCount: number;
}

export const CURRENT_CHUNK_SCHEMA = 1;

export function encodeHeader(h: ChunkSaveHeader): Uint8Array {
  const ab = new ArrayBuffer(48);
  const v = new DataView(ab);
  v.setUint32(0, h.schemaVersion, true);
  v.setInt32(4, h.cx, true);
  v.setInt32(8, h.cz, true);
  v.setUint32(12, h.paletteLength, true);
  v.setUint32(16, h.packedDataLength, true);
  v.setUint32(20, h.skyLightLength, true);
  v.setUint32(24, h.blockLightLength, true);
  v.setUint32(28, h.biomeLength, true);
  v.setUint32(32, h.blockEntityCount, true);
  v.setUint32(36, h.scheduledTickCount, true);
  return new Uint8Array(ab);
}

export function decodeHeader(buf: Uint8Array): ChunkSaveHeader {
  const v = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  return {
    schemaVersion: v.getUint32(0, true),
    cx: v.getInt32(4, true),
    cz: v.getInt32(8, true),
    paletteLength: v.getUint32(12, true),
    packedDataLength: v.getUint32(16, true),
    skyLightLength: v.getUint32(20, true),
    blockLightLength: v.getUint32(24, true),
    biomeLength: v.getUint32(28, true),
    blockEntityCount: v.getUint32(32, true),
    scheduledTickCount: v.getUint32(36, true),
  };
}
