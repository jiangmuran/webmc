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

export function transferablesOfRequest(req: MesherRequest): ArrayBuffer[] {
  const out: ArrayBuffer[] = [
    asBuffer(req.paletteOpaque.buffer),
    asBuffer(req.paletteColor.buffer),
  ];
  if (req.indices) out.push(asBuffer(req.indices.buffer));
  for (const k of [
    'neighborNX',
    'neighborPX',
    'neighborNY',
    'neighborPY',
    'neighborNZ',
    'neighborPZ',
    'flatSkyLight',
    'flatBlockLight',
  ] as const) {
    const n = req[k];
    if (n) out.push(asBuffer(n.buffer));
  }
  return out;
}

export function transferablesOfResponse(res: MesherResponse): ArrayBuffer[] {
  return [
    asBuffer(res.positions.buffer),
    asBuffer(res.normals.buffer),
    asBuffer(res.colors.buffer),
    asBuffer(res.indices.buffer),
  ];
}
