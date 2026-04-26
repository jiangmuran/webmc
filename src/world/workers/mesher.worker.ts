/// <reference lib="webworker" />
import { SUBCHUNK_DIM, SUBCHUNK_VOLUME } from '../SubChunk';
import { readIndex } from '../packed-indices';
import type { Snapshot } from '../meshing/snapshot';
import { type MesherNeighbors, type OpaqueSampler, meshSnapshot } from '../meshing/greedy';
import type { FromWorker, MesherRequest } from './mesher.protocol';
import { transferablesOfResponse } from './mesher.protocol';

function sampler(arr: Uint8Array | null): OpaqueSampler | null {
  if (!arr) return null;
  return (a, b) => (arr[a * SUBCHUNK_DIM + b] ?? 0) !== 0;
}

function neighborsOf(req: MesherRequest): MesherNeighbors {
  return {
    nx: sampler(req.neighborNX),
    px: sampler(req.neighborPX),
    ny: sampler(req.neighborNY),
    py: sampler(req.neighborPY),
    nz: sampler(req.neighborNZ),
    pz: sampler(req.neighborPZ),
  };
}

// Shared "fully sky-lit" / "no block light" defaults — only read by the
// greedy mesher, so one immutable copy per worker is safe and avoids
// allocating 8 KB on every cold meshing job (light=undefined cases).
const DEFAULT_FLAT_SKY_LIGHT = new Uint8Array(SUBCHUNK_VOLUME).fill(15);
const DEFAULT_FLAT_BLOCK_LIGHT = new Uint8Array(SUBCHUNK_VOLUME);

function unpackSnapshot(req: MesherRequest): Snapshot {
  const flatIdx = new Uint16Array(SUBCHUNK_VOLUME);
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    flatIdx[i] = readIndex(req.indices, i, req.bitsPerIndex);
  }
  const flatSkyLight = req.flatSkyLight ?? DEFAULT_FLAT_SKY_LIGHT;
  const flatBlockLight = req.flatBlockLight ?? DEFAULT_FLAT_BLOCK_LIGHT;
  return {
    flatIdx,
    paletteOpaque: req.paletteOpaque,
    paletteColor: req.paletteColor,
    paletteSize: req.paletteOpaque.length,
    flatSkyLight,
    flatBlockLight,
  };
}

self.addEventListener('message', (e: MessageEvent<MesherRequest>) => {
  const req = e.data;
  let snap;
  try {
    snap = unpackSnapshot(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const res: FromWorker = { type: 'mesh-error', id: req.id, message };
    (self as unknown as Worker).postMessage(res);
    return;
  }
  const t0 = performance.now();
  const out = meshSnapshot(snap, neighborsOf(req));
  const elapsedMs = performance.now() - t0;
  const res: FromWorker = {
    type: 'mesh-result',
    id: req.id,
    cx: req.cx,
    cy: req.cy,
    cz: req.cz,
    positions: out.positions,
    normals: out.normals,
    colors: out.colors,
    indices: out.indices,
    quadCount: out.quadCount,
    elapsedMs,
  };
  (self as unknown as Worker).postMessage(res, transferablesOfResponse(res));
});
