import type { BitsPerIndex } from '../packed-indices';

export interface MesherRequest {
  type: 'mesh';
  id: number;
  cx: number;
  cy: number;
  cz: number;
  paletteOpaque: Uint8Array;
  paletteColor: Uint8Array;
  bitsPerIndex: BitsPerIndex;
  indices: Uint32Array | null;
  neighborNX: Uint8Array | null;
  neighborPX: Uint8Array | null;
  neighborNY: Uint8Array | null;
  neighborPY: Uint8Array | null;
  neighborNZ: Uint8Array | null;
  neighborPZ: Uint8Array | null;
  flatSkyLight: Uint8Array | null;
  flatBlockLight: Uint8Array | null;
}

export interface MesherResponse {
  type: 'mesh-result';
  id: number;
  cx: number;
  cy: number;
  cz: number;
  positions: Float32Array;
  normals: Int8Array;
  colors: Uint8Array;
  indices: Uint32Array;
  quadCount: number;
  elapsedMs: number;
}

export interface MesherError {
  type: 'mesh-error';
  id: number;
  message: string;
}

export type FromWorker = MesherResponse | MesherError;

function asBuffer(b: ArrayBufferLike): ArrayBuffer {
  return b as ArrayBuffer;
}

// Hoisted optional-field key list — was rebuilt as a fresh
// `as const` array per transferablesOfRequest call.
const TRANSFER_OPTIONAL_KEYS = [
  'neighborNX',
  'neighborPX',
  'neighborNY',
  'neighborPY',
  'neighborNZ',
  'neighborPZ',
  'flatSkyLight',
  'flatBlockLight',
] as const;
// Reused result array. postMessage reads it synchronously and doesn't
// retain the reference; the caller (MesherClient.mesh) doesn't hold
// onto it either. Per-thread sharing is safe (main thread + each
// worker each get their own module copy).
const TRANSFER_REQ_OUT: ArrayBuffer[] = [];
const TRANSFER_RES_OUT: ArrayBuffer[] = [];

export function transferablesOfRequest(req: MesherRequest): ArrayBuffer[] {
  const out = TRANSFER_REQ_OUT;
  out.length = 0;
  out.push(asBuffer(req.paletteOpaque.buffer));
  out.push(asBuffer(req.paletteColor.buffer));
  if (req.indices) out.push(asBuffer(req.indices.buffer));
  for (let i = 0; i < TRANSFER_OPTIONAL_KEYS.length; i++) {
    const n = req[TRANSFER_OPTIONAL_KEYS[i]!];
    if (n) out.push(asBuffer(n.buffer));
  }
  return out;
}

export function transferablesOfResponse(res: MesherResponse): ArrayBuffer[] {
  const out = TRANSFER_RES_OUT;
  out.length = 0;
  out.push(asBuffer(res.positions.buffer));
  out.push(asBuffer(res.normals.buffer));
  out.push(asBuffer(res.colors.buffer));
  out.push(asBuffer(res.indices.buffer));
  return out;
}
