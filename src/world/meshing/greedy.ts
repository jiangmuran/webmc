import type { BlockState } from '@/blocks/state';
import { SUBCHUNK_DIM, type SubChunk, localIndex } from '../SubChunk';

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
  colorOf: (state: BlockState) => readonly [number, number, number];
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

function decodeFlat(self: SubChunk, out: Uint16Array): void {
  for (let y = 0; y < SUBCHUNK_DIM; y++) {
    for (let z = 0; z < SUBCHUNK_DIM; z++) {
      for (let x = 0; x < SUBCHUNK_DIM; x++) {
        const i = localIndex(x, y, z);
        const state = self.get(x, y, z);
        const pIdx = self.palette.indexOf(state);
        out[i] = pIdx < 0 ? 0 : pIdx;
      }
    }
  }
}

// Classical greedy meshing (Mikola-Lysenko style): 2D greedy merge per slice
// per axis. Neighbor-aware at chunk borders so seams disappear.
// A future micro-milestone can replace this with binary-bitmask greedy
// (cgerikj) if perf demands; the output contract is stable.
export function meshSubChunk(input: MesherInput): MeshOutput {
  const { self, neighbors, isOpaque, colorOf } = input;
  const D = SUBCHUNK_DIM;

  const palette = self.palette;
  const paletteSize = palette.size;
  const paletteOpaque = new Uint8Array(paletteSize);
  const paletteColor = new Uint8Array(paletteSize * 3);
  for (let i = 0; i < paletteSize; i++) {
    const state = palette.get(i);
    paletteOpaque[i] = isOpaque(state) ? 1 : 0;
    const c = colorOf(state);
    paletteColor[i * 3] = c[0];
    paletteColor[i * 3 + 1] = c[1];
    paletteColor[i * 3 + 2] = c[2];
  }

  const flatIdx = new Uint16Array(D * D * D);
  decodeFlat(self, flatIdx);

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

            const c0x = ox,
              c0y = oy,
              c0z = oz;
            const c1x = ox + dux,
              c1y = oy + duy,
              c1z = oz + duz;
            const c2x = ox + dux + dvx,
              c2y = oy + duy + dvy,
              c2z = oz + duz + dvz;
            const c3x = ox + dvx,
              c3y = oy + dvy,
              c3z = oz + dvz;

            const r = paletteColor[val * 3] ?? 0;
            const g = paletteColor[val * 3 + 1] ?? 0;
            const b = paletteColor[val * 3 + 2] ?? 0;

            if (s === 1) {
              positions.push(c0x, c0y, c0z, c1x, c1y, c1z, c2x, c2y, c2z, c3x, c3y, c3z);
            } else {
              positions.push(c0x, c0y, c0z, c3x, c3y, c3z, c2x, c2y, c2z, c1x, c1y, c1z);
            }
            for (let k = 0; k < 4; k++) {
              normals.push(nx, ny, nz);
              colors.push(r, g, b, 255);
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
