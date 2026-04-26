import type { BlockState } from '@/blocks/state';
import { AIR } from '@/blocks/state';
import { CHUNK_SECTIONS, Chunk } from '@/world/Chunk';
import { SUBCHUNK_VOLUME } from '@/world/SubChunk';
import { type BitsPerIndex, readIndex, wordsNeeded } from '@/world/packed-indices';
import type { ChunkLight } from '@/world/lighting';
import { newChunkLight } from '@/world/lighting';

export const MAGIC = 0x5745_4243;
export const SCHEMA_VERSION = 1;

const FLAG_LIGHT = 1 << 0;

const HEADER_BYTES = 24;

export interface EncodedChunk {
  bytes: Uint8Array;
  sectionCount: number;
}

function collectSections(chunk: Chunk): number[] {
  const indices: number[] = [];
  for (let cy = 0; cy < CHUNK_SECTIONS; cy++) {
    if (chunk.section(cy)) indices.push(cy);
  }
  return indices;
}

function validBits(bits: number): BitsPerIndex {
  if (bits === 0 || bits === 4 || bits === 8 || bits === 16) return bits;
  throw new Error(`chunk-codec: invalid bitsPerIndex ${String(bits)}`);
}

function estimateEncodedLength(
  sections: readonly { bits: BitsPerIndex; paletteSize: number; hasLight: boolean }[],
): number {
  let total = HEADER_BYTES;
  total += 4; // CRC
  for (const s of sections) {
    total += 1 + 2 + s.paletteSize * 4;
    if (s.bits > 0) total += wordsNeeded(SUBCHUNK_VOLUME, s.bits) * 4;
    if (s.hasLight) total += SUBCHUNK_VOLUME;
  }
  return total;
}

export function encodeChunk(chunk: Chunk, light?: ChunkLight): Uint8Array {
  const ys = collectSections(chunk);
  let sectionMask = 0;
  for (const cy of ys) sectionMask |= 1 << cy;

  const sectionMetas = ys.map((cy) => {
    const sec = chunk.section(cy);
    if (!sec) throw new Error('unreachable: section missing after collect');
    return {
      cy,
      sec,
      bits: sec.bitsPerIndex,
      paletteSize: sec.palette.size,
      hasLight: !!light?.sections[cy],
    };
  });

  const anyLight = sectionMetas.some((m) => m.hasLight);
  const flags = anyLight ? FLAG_LIGHT : 0;

  const lengthEstimate = estimateEncodedLength(
    sectionMetas.map((m) => ({ bits: m.bits, paletteSize: m.paletteSize, hasLight: m.hasLight })),
  );
  const buf = new ArrayBuffer(lengthEstimate);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);
  let offset = 0;

  view.setUint32(offset, MAGIC, true);
  offset += 4;
  view.setUint16(offset, SCHEMA_VERSION, true);
  offset += 2;
  view.setUint16(offset, flags, true);
  offset += 2;
  view.setInt32(offset, chunk.cx, true);
  offset += 4;
  view.setInt32(offset, chunk.cz, true);
  offset += 4;
  view.setUint32(offset, sectionMask, true);
  offset += 4;
  const payloadLenOffset = offset;
  view.setUint32(offset, 0, true);
  offset += 4;

  const payloadStart = offset;

  for (const m of sectionMetas) {
    u8[offset++] = m.bits;
    view.setUint16(offset, m.paletteSize, true);
    offset += 2;
    for (let i = 0; i < m.paletteSize; i++) {
      view.setUint32(offset, m.sec.palette.get(i) >>> 0, true);
      offset += 4;
    }
    if (m.bits > 0) {
      const indices = m.sec.indices;
      const words = wordsNeeded(SUBCHUNK_VOLUME, m.bits);
      for (let i = 0; i < words; i++) {
        view.setUint32(offset, indices ? (indices[i] ?? 0) : 0, true);
        offset += 4;
      }
    }
    if (m.hasLight && light) {
      const secLight = light.sections[m.cy];
      if (secLight) {
        u8.set(secLight, offset);
        offset += SUBCHUNK_VOLUME;
      }
    }
  }

  const payloadLen = offset - payloadStart;
  view.setUint32(payloadLenOffset, payloadLen, true);

  const crc = crc32(u8.subarray(0, offset));
  view.setUint32(offset, crc >>> 0, true);
  offset += 4;

  return u8.subarray(0, offset);
}

export interface DecodedChunk {
  cx: number;
  cz: number;
  schemaVersion: number;
  chunk: Chunk;
  light: ChunkLight | null;
}

export function decodeChunk(bytes: Uint8Array): DecodedChunk {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  const magic = view.getUint32(offset, true);
  offset += 4;
  if (magic !== MAGIC) throw new Error(`chunk-codec: bad magic 0x${magic.toString(16)}`);
  const schemaVersion = view.getUint16(offset, true);
  offset += 2;
  // Future-version chunks would silently miscount fields. Throw a clear
  // error so the chunk is regenerated rather than corrupting the world.
  // Old saves with same/lower version are still readable.
  if (schemaVersion > SCHEMA_VERSION) {
    throw new Error(
      `chunk-codec: schema version ${String(schemaVersion)} > supported ${String(SCHEMA_VERSION)}`,
    );
  }
  const flags = view.getUint16(offset, true);
  offset += 2;
  const cx = view.getInt32(offset, true);
  offset += 4;
  const cz = view.getInt32(offset, true);
  offset += 4;
  const sectionMask = view.getUint32(offset, true);
  offset += 4;
  const payloadLen = view.getUint32(offset, true);
  offset += 4;

  const payloadStart = offset;
  const hasLight = (flags & FLAG_LIGHT) !== 0;

  const chunk = new Chunk(cx, cz);
  const light = hasLight ? newChunkLight() : null;

  for (let cy = 0; cy < CHUNK_SECTIONS; cy++) {
    if (!(sectionMask & (1 << cy))) continue;
    const bits = validBits(bytes[offset] ?? 0);
    offset += 1;
    const paletteSize = view.getUint16(offset, true);
    offset += 2;
    const paletteStates: BlockState[] = [];
    for (let i = 0; i < paletteSize; i++) {
      paletteStates.push(view.getUint32(offset, true));
      offset += 4;
    }
    const sec = chunk.ensureSection(cy);
    for (let i = 0; i < paletteSize; i++) {
      if (i === 0) continue;
      sec.palette.add(paletteStates[i] ?? AIR);
    }
    if (paletteStates[0] !== undefined && paletteStates[0] !== AIR) {
      sec.fill(paletteStates[0]);
      for (let i = 1; i < paletteSize; i++) sec.palette.add(paletteStates[i] ?? AIR);
    }
    if (bits > 0) {
      const words = wordsNeeded(SUBCHUNK_VOLUME, bits);
      const indices = new Uint32Array(words);
      for (let i = 0; i < words; i++) {
        indices[i] = view.getUint32(offset, true);
        offset += 4;
      }
      for (let pos = 0; pos < SUBCHUNK_VOLUME; pos++) {
        const idx = readIndex(indices, pos, bits);
        const state = paletteStates[idx] ?? AIR;
        const x = pos & 15;
        const z = (pos >> 4) & 15;
        const y = (pos >> 8) & 15;
        if (state !== AIR) sec.set(x, y, z, state);
      }
    }
    if (hasLight && light) {
      const lightBytes = new Uint8Array(SUBCHUNK_VOLUME);
      for (let i = 0; i < SUBCHUNK_VOLUME; i++) lightBytes[i] = bytes[offset + i] ?? 0;
      offset += SUBCHUNK_VOLUME;
      light.sections[cy] = lightBytes;
    }
  }

  if (offset - payloadStart !== payloadLen) {
    throw new Error(
      `chunk-codec: payload length mismatch (${(offset - payloadStart).toString()} vs ${payloadLen.toString()})`,
    );
  }
  const expectedCrc = crc32(bytes.subarray(0, offset));
  const actualCrc = view.getUint32(offset, true) >>> 0;
  if (actualCrc !== expectedCrc) {
    throw new Error('chunk-codec: CRC mismatch');
  }

  return { cx, cz, schemaVersion, chunk, light };
}

// Standard IEEE 802.3 CRC-32. Small table, built once.
const CRC_TABLE = ((): Uint32Array => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = ((crc >>> 8) ^ (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0)) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
