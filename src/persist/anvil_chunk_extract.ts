import { gunzip, inflateZlib } from './nbt_gzip';
import { decodeNbt, type NbtRoot } from './nbt_decode';
import { parseHeader, chunkLocation, SECTOR_SIZE, type McaHeader } from './anvil_import_stub';

// Per-chunk Anvil payload format:
//   uint32 BE: total length (excluding this prefix), in bytes
//   uint8: compression type — 1 gzip, 2 zlib, 3 uncompressed
//   data: <length-1> bytes
//
// Source: minecraft.wiki "Region file format". Behavioral spec — clean-room safe.

export type AnvilCompression = 1 | 2 | 3;

export interface AnvilChunkPayload {
  compression: AnvilCompression;
  body: Uint8Array;
}

export function readChunkPayload(
  bytes: Uint8Array,
  header: McaHeader,
  localX: number,
  localZ: number,
): AnvilChunkPayload | null {
  const loc = chunkLocation(header, localX, localZ);
  if (!loc) return null;
  const start = loc.sector * SECTOR_SIZE;
  if (start + 5 > bytes.length) return null;
  const dv = new DataView(bytes.buffer, bytes.byteOffset + start, bytes.length - start);
  const totalLen = dv.getUint32(0);
  const compression = dv.getUint8(4) as AnvilCompression;
  if (compression !== 1 && compression !== 2 && compression !== 3) return null;
  const bodyLen = totalLen - 1;
  if (bodyLen < 0 || start + 5 + bodyLen > bytes.length) return null;
  // Slice into a fresh ArrayBuffer-backed Uint8Array so downstream
  // DecompressionStream calls aren't tripped by SharedArrayBuffer typing.
  const body = new Uint8Array(bodyLen);
  body.set(bytes.subarray(start + 5, start + 5 + bodyLen));
  return { compression, body };
}

export async function decodeChunkNbt(payload: AnvilChunkPayload): Promise<NbtRoot> {
  let raw: Uint8Array;
  if (payload.compression === 1) raw = await gunzip(payload.body);
  else if (payload.compression === 2) raw = await inflateZlib(payload.body);
  else raw = payload.body;
  return decodeNbt(raw);
}

// One-shot helper: region bytes → decoded chunk root (or null if missing).
export async function extractChunkFromRegion(
  bytes: Uint8Array,
  cx: number,
  cz: number,
): Promise<NbtRoot | null> {
  const header = parseHeader(bytes);
  const localX = ((cx % 32) + 32) % 32;
  const localZ = ((cz % 32) + 32) % 32;
  const payload = readChunkPayload(bytes, header, localX, localZ);
  if (!payload) return null;
  return decodeChunkNbt(payload);
}
