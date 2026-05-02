import type { BlockState } from '@/blocks/state';
import { CHUNK_SECTIONS, Chunk } from '@/world/Chunk';
import { SubChunk, SUBCHUNK_VOLUME } from '@/world/SubChunk';
import { type BitsPerIndex, wordsNeeded } from '@/world/packed-indices';
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

// Reused per-encode scratches. encodeChunk runs on every chunkStore
// flush (1Hz baseline; up to 32 chunks per batch). Each call previously
// allocated a fresh ys[], a fresh sectionMetas[] of {cy, sec, bits, ...}
// objects, AND a fresh array-of-{bits,paletteSize,hasLight} for the
// length estimator pass. Encoding is synchronous and single-threaded
// on the main thread, so module-scope reuse is safe.
const collectSectionsScratch: number[] = [];
interface SectionMeta {
  cy: number;
  sec: SubChunk;
  bits: BitsPerIndex;
  paletteSize: number;
  hasLight: boolean;
}
const sectionMetasScratch: SectionMeta[] = [];
// Reused per-section palette state buffer for decodeChunk. Palette's
// constructor spread-copies its input, so this can be refilled across
// sections and across calls without affecting previously-decoded
// chunks. Was a fresh BlockState[] per section.
const decodePaletteScratch: BlockState[] = [];

function collectSectionsInto(chunk: Chunk, out: number[]): number[] {
  out.length = 0;
  for (let cy = 0; cy < CHUNK_SECTIONS; cy++) {
    const sec = chunk.section(cy);
    // Skip null AND all-air sections. Common after dig-down or initial
    // sky sections — same on reload (decoder treats missing section as
    // air via sectionMask bit unset). Saves ~7 bytes per skipped section
    // and one per-section traversal in encode/decode.
    if (sec && sec.nonAirCount > 0) out.push(cy);
  }
  return out;
}

function validBits(bits: number): BitsPerIndex {
  if (bits === 0 || bits === 4 || bits === 8 || bits === 16) return bits;
  throw new Error(`chunk-codec: invalid bitsPerIndex ${String(bits)}`);
}

function estimateEncodedLengthFromMetas(sections: readonly SectionMeta[]): number {
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
  const ys = collectSectionsInto(chunk, collectSectionsScratch);
  let sectionMask = 0;
  for (const cy of ys) sectionMask |= 1 << cy;

  // Refill sectionMetasScratch in place. Was a chained .map().map() that
  // built two fresh arrays of throwaway objects on every chunk encode.
  const sectionMetas = sectionMetasScratch;
  while (sectionMetas.length > ys.length) sectionMetas.pop();
  let anyLight = false;
  for (let i = 0; i < ys.length; i++) {
    const cy = ys[i]!;
    const sec = chunk.section(cy);
    if (!sec) throw new Error('unreachable: section missing after collect');
    const hasLight = !!light?.sections[cy];
    if (hasLight) anyLight = true;
    let m = sectionMetas[i];
    if (!m) {
      m = { cy, sec, bits: sec.bitsPerIndex, paletteSize: sec.palette.size, hasLight };
      sectionMetas.push(m);
    } else {
      m.cy = cy;
      m.sec = sec;
      m.bits = sec.bitsPerIndex;
      m.paletteSize = sec.palette.size;
      m.hasLight = hasLight;
    }
  }
  const flags = anyLight ? FLAG_LIGHT : 0;

  const lengthEstimate = estimateEncodedLengthFromMetas(sectionMetas);
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
    // Direct array read on palette.entries skips the per-call
    // Palette.get function dispatch + its `if undefined throw` safety
    // check. palette.size is the bound, so `entries[i]!` is in range.
    const entries = m.sec.palette.entries;
    for (let i = 0; i < m.paletteSize; i++) {
      view.setUint32(offset, entries[i]! >>> 0, true);
      offset += 4;
    }
    if (m.bits > 0) {
      const indices = m.sec.indices;
      const words = wordsNeeded(SUBCHUNK_VOLUME, m.bits);
      const byteLen = words * 4;
      if (indices) {
        // Bulk byte-level memcpy of the Uint32Array's underlying bytes
        // (little-endian on every browser-supported platform — same as
        // `setUint32(..., true)`). Replaces the per-word setUint32 loop
        // which paid a JS function-call + bounds-check per word, ~50K
        // calls per chunk per save batch on full sections.
        const indicesBytes = new Uint8Array(indices.buffer, indices.byteOffset, byteLen);
        u8.set(indicesBytes, offset);
      } else {
        // bits>0 but no indices: section is uniform (single-palette).
        // Buffer is already zero-initialized (ArrayBuffer init); just
        // skip past the range.
      }
      offset += byteLen;
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
    // bytes is Uint8Array; offset stays in range — `!` over `?? 0`.
    const bits = validBits(bytes[offset]!);
    offset += 1;
    const paletteSize = view.getUint16(offset, true);
    offset += 2;
    // Reused per-section palette scratch — Palette constructor copies
    // the array via spread, so we can refill in place across sections
    // and across decodeChunk calls. Was a fresh BlockState[] per
    // section per chunk load.
    const paletteStates = decodePaletteScratch;
    paletteStates.length = paletteSize;
    for (let i = 0; i < paletteSize; i++) {
      paletteStates[i] = view.getUint32(offset, true);
      offset += 4;
    }
    let indices: Uint32Array | null = null;
    if (bits > 0) {
      const words = wordsNeeded(SUBCHUNK_VOLUME, bits);
      const byteLen = words * 4;
      indices = new Uint32Array(words);
      // Bulk byte-level copy from the source bytes. Replaces the per-
      // word getUint32 loop (~50K calls per chunk per load batch on
      // full sections). Little-endian on every browser-supported
      // platform — matches the encoder's byte layout.
      const indicesBytes = new Uint8Array(indices.buffer);
      indicesBytes.set(bytes.subarray(offset, offset + byteLen));
      offset += byteLen;
    }
    // Bulk-construct the SubChunk from the wire data instead of per-
    // cell sec.set() — saved ~4096 palette+bitpack ops per non-empty
    // section. Decode is now O(words) instead of O(volume).
    chunk.setSection(cy, SubChunk.fromRaw(paletteStates, bits, indices));
    if (hasLight && light) {
      // Per-byte copy was O(N) JS interpreter overhead — slice() is a
      // single typed-array memcpy. Same correctness (independent
      // copy, owns its own buffer).
      light.sections[cy] = bytes.slice(offset, offset + SUBCHUNK_VOLUME);
      offset += SUBCHUNK_VOLUME;
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
  // Indexed for-loop instead of for-of: V8 generally optimizes for-of
  // on TypedArray, but indexed access is unambiguous and crc32 walks
  // every byte of the encoded chunk (often 100+ KB at world save). The
  // CRC_TABLE lookup is bounded to 0..255, so the index-undefined
  // fallback is purely a TS noUncheckedIndexedAccess satisfier.
  let crc = 0xffffffff;
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    // CRC_TABLE is Uint32Array(256), indexed by `& 0xff` — always in
    // range. `!` skips the per-byte coalesce (TS narrowing artifact).
    crc = ((crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]!) & 0xff]!) >>> 0;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
