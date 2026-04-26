import type { BlockState } from '@/blocks/state';
import type { BitsPerIndex } from '../packed-indices';
import { SUBCHUNK_DIM, type SubChunk } from '../SubChunk';
import { type FaceColors, serializePalette } from '../meshing/snapshot';
import type { FromWorker, MesherRequest, MesherResponse } from './mesher.protocol';
import { transferablesOfRequest } from './mesher.protocol';

export interface BorderOpacity {
  nx: Uint8Array | null;
  px: Uint8Array | null;
  ny: Uint8Array | null;
  py: Uint8Array | null;
  nz: Uint8Array | null;
  pz: Uint8Array | null;
}

export const EMPTY_BORDERS: BorderOpacity = {
  nx: null,
  px: null,
  ny: null,
  py: null,
  nz: null,
  pz: null,
};

export function extractBorderFromSubChunk(
  self: SubChunk,
  face: keyof BorderOpacity,
  isOpaque: (s: BlockState) => boolean,
): Uint8Array {
  const D = SUBCHUNK_DIM;
  const out = new Uint8Array(D * D);
  // Uniform section fast path: every cell is the same block, so the
  // border is solid 1 or solid 0. Avoids 256 self.get calls per face
  // (6 faces per remesh × thousands of remeshes per chunk-stream).
  if (self.isUniform) {
    const v = isOpaque(self.palette.get(0)) ? 1 : 0;
    if (v !== 0) out.fill(v);
    return out;
  }
  for (let a = 0; a < D; a++) {
    for (let b = 0; b < D; b++) {
      let x = 0;
      let y = 0;
      let z = 0;
      switch (face) {
        case 'nx':
          x = D - 1;
          y = a;
          z = b;
          break;
        case 'px':
          x = 0;
          y = a;
          z = b;
          break;
        case 'ny':
          x = a;
          y = D - 1;
          z = b;
          break;
        case 'py':
          x = a;
          y = 0;
          z = b;
          break;
        case 'nz':
          x = a;
          y = b;
          z = D - 1;
          break;
        case 'pz':
          x = a;
          y = b;
          z = 0;
          break;
      }
      out[a * D + b] = isOpaque(self.get(x, y, z)) ? 1 : 0;
    }
  }
  return out;
}

export interface BuildOptions {
  flatSkyLight: Uint8Array | null;
  flatBlockLight: Uint8Array | null;
}

export function buildMesherRequest(
  id: number,
  cx: number,
  cy: number,
  cz: number,
  self: SubChunk,
  isOpaque: (s: BlockState) => boolean,
  faceColorsOf: (s: BlockState) => FaceColors,
  borders: BorderOpacity,
  light: BuildOptions = { flatSkyLight: null, flatBlockLight: null },
): MesherRequest {
  const blob = serializePalette(self, isOpaque, faceColorsOf);
  const bitsPerIndex: BitsPerIndex = blob.bitsPerIndex;
  return {
    type: 'mesh',
    id,
    cx,
    cy,
    cz,
    paletteOpaque: blob.paletteOpaque,
    paletteColor: blob.paletteColor,
    bitsPerIndex,
    indices: blob.indices,
    neighborNX: borders.nx,
    neighborPX: borders.px,
    neighborNY: borders.ny,
    neighborPY: borders.py,
    neighborNZ: borders.nz,
    neighborPZ: borders.pz,
    flatSkyLight: light.flatSkyLight,
    flatBlockLight: light.flatBlockLight,
  };
}

export interface MesherJob {
  id: number;
  resolve: (res: MesherResponse) => void;
  reject: (err: Error) => void;
}

export class MesherClient {
  // Pool of workers for parallel meshing across cores. Chunks stream
  // ~10-15ms per section in the worker; with one worker, perFrameBudget
  // chunks per frame queues serially behind a single thread. With N
  // workers, sections fan out across cores. Round-robin dispatch keeps
  // load balanced; each worker tracks its own jobs by id so responses
  // route back correctly.
  private readonly workers: Worker[];
  private readonly jobs = new Map<number, MesherJob>();
  private _nextId = 1;
  private _nextWorker = 0;

  constructor(workerFactory: () => Worker, poolSize = 1) {
    const size = Math.max(1, Math.floor(poolSize));
    this.workers = new Array<Worker>(size);
    for (let i = 0; i < size; i++) {
      const worker = workerFactory();
      worker.addEventListener('message', (e: MessageEvent<FromWorker>) => {
        const msg = e.data;
        const job = this.jobs.get(msg.id);
        if (!job) return;
        this.jobs.delete(msg.id);
        if (msg.type === 'mesh-result') job.resolve(msg);
        else job.reject(new Error(msg.message));
      });
      worker.addEventListener('error', (e) => {
        // A worker crash loses its in-flight jobs. Reject all pending
        // (we don't track which worker holds which job — overkill at
        // this scale); the chunk loader will re-dispatch on next dirty.
        for (const job of this.jobs.values()) job.reject(new Error(e.message));
        this.jobs.clear();
      });
      this.workers[i] = worker;
    }
  }

  mesh(
    cx: number,
    cy: number,
    cz: number,
    self: SubChunk,
    isOpaque: (s: BlockState) => boolean,
    faceColorsOf: (s: BlockState) => FaceColors,
    borders: BorderOpacity = EMPTY_BORDERS,
    light: BuildOptions = { flatSkyLight: null, flatBlockLight: null },
  ): Promise<MesherResponse> {
    const id = this._nextId++;
    const req = buildMesherRequest(id, cx, cy, cz, self, isOpaque, faceColorsOf, borders, light);
    const worker = this.workers[this._nextWorker]!;
    this._nextWorker = (this._nextWorker + 1) % this.workers.length;
    return new Promise<MesherResponse>((resolve, reject) => {
      this.jobs.set(id, { id, resolve, reject });
      worker.postMessage(req, transferablesOfRequest(req));
    });
  }

  terminate(): void {
    for (const worker of this.workers) worker.terminate();
    for (const job of this.jobs.values()) {
      job.reject(new Error('MesherClient terminated'));
    }
    this.jobs.clear();
  }

  get poolSize(): number {
    return this.workers.length;
  }
}

// Plan: N-1 cores capped at 4 on mobile (per Master Plan). Mobile
// detection here is light to avoid pulling in the full UA matcher.
function computePoolSize(): number {
  const cores =
    typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number'
      ? navigator.hardwareConcurrency
      : 4;
  const isMobile =
    typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const cap = isMobile ? 2 : 4;
  return Math.max(1, Math.min(cap, cores - 1));
}

export function createMesherClient(): MesherClient {
  return new MesherClient(
    () =>
      new Worker(new URL('./mesher.worker.ts', import.meta.url), {
        type: 'module',
      }),
    computePoolSize(),
  );
}
