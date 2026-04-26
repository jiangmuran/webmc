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

// Reused per-job neighbors wrapper. The OpaqueSampler closures inside
// still allocate per call (each captures its own `arr`), but skipping
// the wrapper literal saves one allocation per dispatch.
const NEIGHBORS_SCRATCH: MesherNeighbors = {
  nx: null,
  px: null,
  ny: null,
  py: null,
  nz: null,
  pz: null,
};

function neighborsOf(req: MesherRequest): MesherNeighbors {
  NEIGHBORS_SCRATCH.nx = sampler(req.neighborNX);
  NEIGHBORS_SCRATCH.px = sampler(req.neighborPX);
  NEIGHBORS_SCRATCH.ny = sampler(req.neighborNY);
  NEIGHBORS_SCRATCH.py = sampler(req.neighborPY);
  NEIGHBORS_SCRATCH.nz = sampler(req.neighborNZ);
  NEIGHBORS_SCRATCH.pz = sampler(req.neighborPZ);
  return NEIGHBORS_SCRATCH;
}

// Shared "fully sky-lit" / "no block light" defaults — only read by the
// greedy mesher, so one immutable copy per worker is safe and avoids
// allocating 8 KB on every cold meshing job (light=undefined cases).
const DEFAULT_FLAT_SKY_LIGHT = new Uint8Array(SUBCHUNK_VOLUME).fill(15);
const DEFAULT_FLAT_BLOCK_LIGHT = new Uint8Array(SUBCHUNK_VOLUME);
// Reused per-worker flatIdx scratch + Snapshot wrapper. flatIdx is
// only READ by the greedy mesher (never escaped from the worker), and
// each worker is single-threaded — refilling in place is safe. Cast
// away `readonly` for mutation; the public Snapshot interface is
// still readonly to discourage external mutation.
type MutableSnapshot = { -readonly [K in keyof Snapshot]: Snapshot[K] };
const FLAT_IDX_SCRATCH = new Uint16Array(SUBCHUNK_VOLUME);
const SNAPSHOT_SCRATCH: MutableSnapshot = {
  flatIdx: FLAT_IDX_SCRATCH,
  paletteOpaque: new Uint8Array(0),
  paletteColor: new Uint8Array(0),
  paletteSize: 0,
  flatSkyLight: DEFAULT_FLAT_SKY_LIGHT,
  flatBlockLight: DEFAULT_FLAT_BLOCK_LIGHT,
};

function unpackSnapshot(req: MesherRequest): Snapshot {
  for (let i = 0; i < SUBCHUNK_VOLUME; i++) {
    FLAT_IDX_SCRATCH[i] = readIndex(req.indices, i, req.bitsPerIndex);
  }
  SNAPSHOT_SCRATCH.paletteOpaque = req.paletteOpaque;
  SNAPSHOT_SCRATCH.paletteColor = req.paletteColor;
  SNAPSHOT_SCRATCH.paletteSize = req.paletteOpaque.length;
  SNAPSHOT_SCRATCH.flatSkyLight = req.flatSkyLight ?? DEFAULT_FLAT_SKY_LIGHT;
  SNAPSHOT_SCRATCH.flatBlockLight = req.flatBlockLight ?? DEFAULT_FLAT_BLOCK_LIGHT;
  return SNAPSHOT_SCRATCH;
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
