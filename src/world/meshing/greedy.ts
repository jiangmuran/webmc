import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, type SubChunk, localIndex } from '../SubChunk';
import {
  COLOR_OFFSET_BOTTOM,
  COLOR_OFFSET_SIDE,
  COLOR_OFFSET_TOP,
  COLOR_STRIDE,
  type FaceColors,
  type Snapshot,
  snapshotSubChunk,
} from './snapshot';

// Border-opacity slices indexed as arr[a * SUBCHUNK_DIM + b]. Was a
// per-face OpaqueSampler closure (`(a, b) => arr[a*D+b] != 0`) — that
// meant 6 fresh closures per mesher request, ~600/sec at chunk
// streaming startup. Holding the raw typed array eliminates the
// closure churn; the inner-loop index math moves into neighborSampler.
export type OpaqueSampler = Uint8Array | null;

export interface MesherNeighbors {
  nx: OpaqueSampler;
  px: OpaqueSampler;
  ny: OpaqueSampler;
  py: OpaqueSampler;
  nz: OpaqueSampler;
  pz: OpaqueSampler;
}

export interface MesherInput {
  self: SubChunk;
  neighbors: MesherNeighbors;
  isOpaque: (state: BlockState) => boolean;
  faceColorsOf: (state: BlockState) => FaceColors;
}

export interface MeshOutput {
  positions: Float32Array;
  normals: Int8Array;
  colors: Uint8Array;
  indices: Uint32Array;
  quadCount: number;
}

export const EMPTY_NEIGHBORS: MesherNeighbors = {
  nx: null,
  px: null,
  ny: null,
  py: null,
  nz: null,
  pz: null,
};

// Reused vertex-buffer scratches. meshSnapshot is called once per
// dispatched chunk (worker side); the resulting number[]s get copied
// into typed arrays at the end and the typed arrays are returned/
// transferred. The intermediate number[]s themselves don't need to
// live across calls. Per-worker module scope is safe (single-threaded
// per worker).
const POSITIONS_SCRATCH: number[] = [];
const NORMALS_SCRATCH: number[] = [];
const COLORS_SCRATCH: number[] = [];
const INDICES_SCRATCH: number[] = [];
// Reused per-slice mask. Was a fresh `new Int32Array(D * D)` per
// meshSnapshot call (1024 bytes); chunk streaming hits ~100 sections
// per second at startup, so the allocation churn was ~100KB/sec on
// each worker thread. Filled with -1 at the start of every w loop, so
// previous-call contents don't leak.
const MASK_SCRATCH = new Int32Array(SUBCHUNK_DIM * SUBCHUNK_DIM);

// Module-scope per-call context, filled by meshSnapshot before the
// inner loops fire. Was 3 fresh closures (lightAt + neighborSampler +
// opaqueAt) allocated per meshSnapshot call — ~3 closures × 100
// dispatches/sec = 300 throwaway closures/sec on each worker.
// Free-functions read these slots directly, no captured-scope.
const D_CONST = SUBCHUNK_DIM;
// Pre-computed faceLight (0..15) → alpha (0..255) table. Was running
// `Math.round((faceLight / 15) * 255)` per quad — divide + multiply +
// round per quad × thousands of quads per chunk = real cost on the
// worker hot loop.
const FACE_LIGHT_ALPHA = new Uint8Array(16);
for (let i = 0; i < 16; i++) FACE_LIGHT_ALPHA[i] = Math.round((i / 15) * 255);

// Module-scope per-call coord scratches. Were function-scoped tuples
// allocated per meshSnapshot call (3 fresh [0,0,0] arrays). Worker is
// single-threaded; meshSnapshot is called serially. Per-worker module
// reuse is safe.
const POS_SCRATCH: [number, number, number] = [0, 0, 0];
const NPOS_SCRATCH: [number, number, number] = [0, 0, 0];
const LIGHT_POS_SCRATCH: [number, number, number] = [0, 0, 0];
let CTX_FLAT_IDX: Uint16Array = new Uint16Array(0);
let CTX_PALETTE_OPAQUE: Uint8Array = new Uint8Array(0);
let CTX_FLAT_SKY: Uint8Array = new Uint8Array(0);
let CTX_FLAT_BLOCK: Uint8Array = new Uint8Array(0);
let CTX_NEIGHBOR_NX: OpaqueSampler = null;
let CTX_NEIGHBOR_PX: OpaqueSampler = null;
let CTX_NEIGHBOR_NY: OpaqueSampler = null;
let CTX_NEIGHBOR_PY: OpaqueSampler = null;
let CTX_NEIGHBOR_NZ: OpaqueSampler = null;
let CTX_NEIGHBOR_PZ: OpaqueSampler = null;

function lightAtCtx(x: number, y: number, z: number): number {
  if (x < 0 || x >= D_CONST || y < 0 || y >= D_CONST || z < 0 || z >= D_CONST) return 15;
  const idx = localIndex(x, y, z);
  // CTX_FLAT_SKY/BLOCK are Uint8Array — valid indices always return a
  // number. `!` skips the per-quad nullish-coalesce (TS narrowing).
  const sky = CTX_FLAT_SKY[idx]!;
  const block = CTX_FLAT_BLOCK[idx]!;
  return sky > block ? sky : block;
}

function opaqueAtCtx(x: number, y: number, z: number): boolean {
  // D_CONST=SUBCHUNK_DIM=16 → `* D_CONST` is `<< 4`. Border lookups
  // here fire 4096 times per axis-pass × 6 passes per mesh; the
  // multiply was the only non-bitwise op in this hot probe.
  // `!`-narrow the typed-array reads (Uint8Array indices in range
  // never return undefined; was paying a per-cell coalesce check).
  if (x < 0) return CTX_NEIGHBOR_NX !== null && CTX_NEIGHBOR_NX[(y << 4) + z]! !== 0;
  if (x >= D_CONST) return CTX_NEIGHBOR_PX !== null && CTX_NEIGHBOR_PX[(y << 4) + z]! !== 0;
  if (y < 0) return CTX_NEIGHBOR_NY !== null && CTX_NEIGHBOR_NY[(x << 4) + z]! !== 0;
  if (y >= D_CONST) return CTX_NEIGHBOR_PY !== null && CTX_NEIGHBOR_PY[(x << 4) + z]! !== 0;
  if (z < 0) return CTX_NEIGHBOR_NZ !== null && CTX_NEIGHBOR_NZ[(x << 4) + y]! !== 0;
  if (z >= D_CONST) return CTX_NEIGHBOR_PZ !== null && CTX_NEIGHBOR_PZ[(x << 4) + y]! !== 0;
  const pIdx = CTX_FLAT_IDX[localIndex(x, y, z)]!;
  return CTX_PALETTE_OPAQUE[pIdx]! !== 0;
}

// Classical greedy meshing (Mikola-Lysenko style): 2D greedy merge per slice
// per axis. Neighbor-aware at chunk borders so seams disappear.
// A future micro-milestone can replace this with binary-bitmask greedy
// (cgerikj) if perf demands; the output contract is stable.
export function meshSnapshot(snap: Snapshot, neighbors: MesherNeighbors): MeshOutput {
  const { flatIdx, paletteOpaque, paletteColor, flatSkyLight, flatBlockLight } = snap;
  const D = SUBCHUNK_DIM;

  // Fill module-scope context for the free-function probes (avoids the
  // 3 per-call closure allocations).
  CTX_FLAT_IDX = flatIdx;
  CTX_PALETTE_OPAQUE = paletteOpaque;
  CTX_FLAT_SKY = flatSkyLight;
  CTX_FLAT_BLOCK = flatBlockLight;
  CTX_NEIGHBOR_NX = neighbors.nx;
  CTX_NEIGHBOR_PX = neighbors.px;
  CTX_NEIGHBOR_NY = neighbors.ny;
  CTX_NEIGHBOR_PY = neighbors.py;
  CTX_NEIGHBOR_NZ = neighbors.nz;
  CTX_NEIGHBOR_PZ = neighbors.pz;

  const positions = POSITIONS_SCRATCH;
  const normals = NORMALS_SCRATCH;
  const colors = COLORS_SCRATCH;
  const indices = INDICES_SCRATCH;
  positions.length = 0;
  normals.length = 0;
  colors.length = 0;
  indices.length = 0;

  const mask = MASK_SCRATCH;
  let quadCount = 0;
  // Reuse module-scope scratches — were function-scoped per-call tuples
  // (3 fresh [0,0,0] arrays per meshSnapshot, ~300/sec at 100
  // dispatches/sec on each worker thread).
  const pos = POS_SCRATCH;
  const npos = NPOS_SCRATCH;
  const lightPos = LIGHT_POS_SCRATCH;

  for (let d = 0; d < 3; d++) {
    const u = (d + 1) % 3;
    const v = (d + 2) % 3;

    for (let s = 0; s < 2; s++) {
      const sign = s === 1 ? 1 : -1;
      const nx = d === 0 ? sign : 0;
      const ny = d === 1 ? sign : 0;
      const nz = d === 2 ? sign : 0;

      for (let w = 0; w < D; w++) {
        mask.fill(-1);

        for (let iv = 0; iv < D; iv++) {
          for (let iu = 0; iu < D; iu++) {
            pos[d] = w;
            pos[u] = iu;
            pos[v] = iv;
            // pos/npos are fixed-size [num,num,num] tuples and we just
            // wrote to all three indices via [d]/[u]/[v] (a permutation
            // of [0,1,2]). The `?? 0` was a TS narrowing artifact (
            // noUncheckedIndexedAccess types reads as `number|undef`),
            // not a runtime concern — `!` skips the per-cell coalesce
            // for what's actually a guaranteed number. Inner loop runs
            // 4096× per axis-pass × 6 passes per mesh.
            const selfIdx = flatIdx[localIndex(pos[0]!, pos[1]!, pos[2]!)]!;
            if (paletteOpaque[selfIdx] !== 1) continue;
            npos[d] = w + sign;
            npos[u] = iu;
            npos[v] = iv;
            if (opaqueAtCtx(npos[0]!, npos[1]!, npos[2]!)) continue;
            mask[(iv << 4) + iu] = selfIdx;
          }
        }

        for (let iv = 0; iv < D; iv++) {
          // D=SUBCHUNK_DIM=16 → `iv * D` = `iv << 4`. Hoist the row
          // base out of the inner loop; saves one multiply per cell
          // visit + per-width-extend + per-height-extend + per-clear.
          const ivBase = iv << 4;
          for (let iu = 0; iu < D; ) {
            // mask is Int32Array; indices always in range. The `?? -1`
            // patterns were TS narrowing only — `!` skips the per-cell
            // coalesce. The sentinel -1 still comes from `mask.fill(-1)`
            // at the top of each w-loop, just no per-read fallback.
            const val = mask[ivBase + iu]!;
            if (val < 0) {
              iu++;
              continue;
            }

            let width = 1;
            while (iu + width < D) {
              const m = mask[ivBase + iu + width]!;
              if (m !== val) break;
              width++;
            }

            let height = 1;
            heightLoop: while (iv + height < D) {
              const rowBase = (iv + height) << 4;
              for (let k = 0; k < width; k++) {
                const m = mask[rowBase + iu + k]!;
                if (m !== val) break heightLoop;
              }
              height++;
            }

            const base = positions.length / 3;
            const ox = d === 0 ? w + (s === 1 ? 1 : 0) : u === 0 ? iu : iv;
            const oy = d === 1 ? w + (s === 1 ? 1 : 0) : u === 1 ? iu : iv;
            const oz = d === 2 ? w + (s === 1 ? 1 : 0) : u === 2 ? iu : iv;
            const dux = u === 0 ? width : 0;
            const duy = u === 1 ? width : 0;
            const duz = u === 2 ? width : 0;
            const dvx = v === 0 ? height : 0;
            const dvy = v === 1 ? height : 0;
            const dvz = v === 2 ? height : 0;

            const c0x = ox;
            const c0y = oy;
            const c0z = oz;
            const c1x = ox + dux;
            const c1y = oy + duy;
            const c1z = oz + duz;
            const c2x = ox + dux + dvx;
            const c2y = oy + duy + dvy;
            const c2z = oz + duz + dvz;
            const c3x = ox + dvx;
            const c3y = oy + dvy;
            const c3z = oz + dvz;

            const faceOffset =
              d === 1 ? (s === 1 ? COLOR_OFFSET_TOP : COLOR_OFFSET_BOTTOM) : COLOR_OFFSET_SIDE;
            const base3 = val * COLOR_STRIDE + faceOffset;
            // paletteColor is Uint8Array; valid indices always return
            // a number. The `?? 0` was TS narrowing only (noUnchecked-
            // IndexedAccess). `!` skips the per-quad fallback eval.
            const r = paletteColor[base3]!;
            const g = paletteColor[base3 + 1]!;
            const b = paletteColor[base3 + 2]!;

            lightPos[0] = 0;
            lightPos[1] = 0;
            lightPos[2] = 0;
            lightPos[d] = w + sign;
            lightPos[u] = iu;
            lightPos[v] = iv;
            const faceLight = lightAtCtx(lightPos[0]!, lightPos[1]!, lightPos[2]!);
            const lightAlpha = FACE_LIGHT_ALPHA[faceLight] ?? 255;

            if (s === 1) {
              positions.push(c0x, c0y, c0z, c1x, c1y, c1z, c2x, c2y, c2z, c3x, c3y, c3z);
            } else {
              positions.push(c0x, c0y, c0z, c3x, c3y, c3z, c2x, c2y, c2z, c1x, c1y, c1z);
            }
            for (let k = 0; k < 4; k++) {
              normals.push(nx, ny, nz);
              colors.push(r, g, b, lightAlpha);
            }

            indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
            quadCount++;

            for (let dy = 0; dy < height; dy++) {
              const rowBase = (iv + dy) << 4;
              for (let dx = 0; dx < width; dx++) {
                mask[rowBase + iu + dx] = -1;
              }
            }

            iu += width;
          }
        }
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Int8Array(normals),
    colors: new Uint8Array(colors),
    indices: new Uint32Array(indices),
    quadCount,
  };
}

export function meshSubChunk(input: MesherInput): MeshOutput {
  const snap = snapshotSubChunk(input.self, input.isOpaque, input.faceColorsOf);
  return meshSnapshot(snap, input.neighbors);
}
