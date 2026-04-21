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

export type OpaqueSampler = (u: number, v: number) => boolean;

export interface MesherNeighbors {
  nx: OpaqueSampler | null;
  px: OpaqueSampler | null;
  ny: OpaqueSampler | null;
  py: OpaqueSampler | null;
  nz: OpaqueSampler | null;
  pz: OpaqueSampler | null;
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

// Classical greedy meshing (Mikola-Lysenko style): 2D greedy merge per slice
// per axis. Neighbor-aware at chunk borders so seams disappear.
// A future micro-milestone can replace this with binary-bitmask greedy
// (cgerikj) if perf demands; the output contract is stable.
export function meshSnapshot(snap: Snapshot, neighbors: MesherNeighbors): MeshOutput {
  const { flatIdx, paletteOpaque, paletteColor, flatSkyLight, flatBlockLight } = snap;
  const D = SUBCHUNK_DIM;

  const lightAt = (x: number, y: number, z: number): number => {
    if (x < 0 || x >= D || y < 0 || y >= D || z < 0 || z >= D) return 15;
    const idx = localIndex(x, y, z);
    const sky = flatSkyLight[idx] ?? 15;
    const block = flatBlockLight[idx] ?? 0;
    return sky > block ? sky : block;
  };

  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const neighborSampler = (dir: keyof MesherNeighbors, a: number, b: number): boolean => {
    const s = neighbors[dir];
    return s ? s(a, b) : false;
  };

  const opaqueAt = (x: number, y: number, z: number): boolean => {
    if (x < 0) return neighborSampler('nx', y, z);
    if (x >= D) return neighborSampler('px', y, z);
    if (y < 0) return neighborSampler('ny', x, z);
    if (y >= D) return neighborSampler('py', x, z);
    if (z < 0) return neighborSampler('nz', x, y);
    if (z >= D) return neighborSampler('pz', x, y);
    const pIdx = flatIdx[localIndex(x, y, z)] ?? 0;
    return (paletteOpaque[pIdx] ?? 0) !== 0;
  };

  const mask = new Int32Array(D * D);
  let quadCount = 0;

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

        const pos = [0, 0, 0];
        const npos = [0, 0, 0];
        for (let iv = 0; iv < D; iv++) {
          for (let iu = 0; iu < D; iu++) {
            pos[d] = w;
            pos[u] = iu;
            pos[v] = iv;
            const selfIdx = flatIdx[localIndex(pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0)] ?? 0;
            if (paletteOpaque[selfIdx] !== 1) continue;
            npos[d] = w + sign;
            npos[u] = iu;
            npos[v] = iv;
            if (opaqueAt(npos[0] ?? 0, npos[1] ?? 0, npos[2] ?? 0)) continue;
            mask[iv * D + iu] = selfIdx;
          }
        }

        for (let iv = 0; iv < D; iv++) {
          for (let iu = 0; iu < D; ) {
            const val = mask[iv * D + iu] ?? -1;
            if (val < 0) {
              iu++;
              continue;
            }

            let width = 1;
            while (iu + width < D && (mask[iv * D + iu + width] ?? -1) === val) width++;

            let height = 1;
            heightLoop: while (iv + height < D) {
              for (let k = 0; k < width; k++) {
                if ((mask[(iv + height) * D + iu + k] ?? -1) !== val) break heightLoop;
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
            const r = paletteColor[base3] ?? 0;
            const g = paletteColor[base3 + 1] ?? 0;
            const b = paletteColor[base3 + 2] ?? 0;

            const lightPos = [0, 0, 0];
            lightPos[d] = w + sign;
            lightPos[u] = iu;
            lightPos[v] = iv;
            const faceLight = lightAt(lightPos[0] ?? 0, lightPos[1] ?? 0, lightPos[2] ?? 0);
            const lightAlpha = Math.round((faceLight / 15) * 255);

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
              for (let dx = 0; dx < width; dx++) {
                mask[(iv + dy) * D + iu + dx] = -1;
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
