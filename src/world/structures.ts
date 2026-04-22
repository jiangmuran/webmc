// Multi-chunk structure placement. A structure is spawned by a deterministic
// per-cell hash at its *anchor chunk*, then generates block-placement events
// that span neighbouring chunks. The coordinator queues events per chunk
// so that when a chunk is generated (or re-generated) it collects any
// pending placements from structures anchored nearby.

import { hash32 } from './noise/perlin';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface StructureBlock {
  pos: Vec3;
  block: string;
}

export interface StructureTemplate {
  name: string;
  // How wide the structure extends from its anchor in *chunks*. A 2×2
  // anchor-sized structure has radius 1 (touches itself + 1 neighbour each way).
  chunkRadius: number;
  // Deterministic per-anchor generation: given anchor chunk (cx, cz) + seed,
  // return the absolute block placements this structure contributes.
  generate(cx: number, cz: number, seed: number): readonly StructureBlock[];
}

export interface StructureRule {
  template: StructureTemplate;
  // Probability per chunk cell of anchoring here. 1/20 etc.
  anchorChance: number;
  anchorSalt: number;
}

// Coordinator — given a chunk (cx, cz) being generated, iterate over nearby
// chunks (within max chunkRadius) and collect every structure template that
// anchors within range AND would place blocks inside this chunk.
export class StructureCoordinator {
  constructor(
    readonly seed: number,
    readonly rules: readonly StructureRule[],
  ) {}

  private maxRadius(): number {
    let m = 0;
    for (const r of this.rules) if (r.template.chunkRadius > m) m = r.template.chunkRadius;
    return m;
  }

  // Does `rule` anchor at (ax, az)?
  private isAnchor(rule: StructureRule, ax: number, az: number): boolean {
    const h = hash32(ax, az, this.seed ^ rule.anchorSalt);
    return (h % 10000) / 10000 < rule.anchorChance;
  }

  // All block placements inside chunk (cx, cz), from any structure anchored
  // near it. Chunk size 16 assumed.
  blocksFor(cx: number, cz: number): readonly StructureBlock[] {
    const out: StructureBlock[] = [];
    const r = this.maxRadius();
    const minX = cx * 16;
    const maxX = minX + 15;
    const minZ = cz * 16;
    const maxZ = minZ + 15;
    for (const rule of this.rules) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          const ax = cx + dx;
          const az = cz + dz;
          if (!this.isAnchor(rule, ax, az)) continue;
          const placements = rule.template.generate(ax, az, this.seed);
          for (const p of placements) {
            if (p.pos.x < minX || p.pos.x > maxX) continue;
            if (p.pos.z < minZ || p.pos.z > maxZ) continue;
            out.push(p);
          }
        }
      }
    }
    return out;
  }
}

// ─── Templates ────────────────────────────────────────────────────────

// Straight mineshaft segment: 5×3×3 tunnel of planks + oak_fence columns.
export const MINESHAFT: StructureTemplate = {
  name: 'mineshaft',
  chunkRadius: 1,
  generate(cx, cz, seed): readonly StructureBlock[] {
    const h = hash32(cx, cz, seed ^ 0x511ee0) >>> 0;
    const yBase = 12 + (h % 30);
    const axis = (h >>> 3) & 1 ? 'x' : 'z';
    const blocks: StructureBlock[] = [];
    const baseX = cx * 16 + ((h >>> 4) & 7);
    const baseZ = cz * 16 + ((h >>> 8) & 7);
    for (let seg = 0; seg < 8; seg++) {
      const px = axis === 'x' ? baseX + seg : baseX;
      const pz = axis === 'z' ? baseZ + seg : baseZ;
      for (let dy = 0; dy < 3; dy++) {
        for (let d = -1; d <= 1; d++) {
          const x = axis === 'x' ? px : baseX + d;
          const z = axis === 'z' ? pz : baseZ + d;
          if (dy === 0) blocks.push({ pos: { x, y: yBase, z }, block: 'webmc:oak_planks' });
          if (dy === 2 && Math.abs(d) === 1) {
            blocks.push({ pos: { x, y: yBase + dy, z }, block: 'webmc:oak_log' });
          }
        }
      }
    }
    return blocks;
  },
};

// Tiny village building: 5×4×5 oak hut.
export const VILLAGE_HUT: StructureTemplate = {
  name: 'village_hut',
  chunkRadius: 1,
  generate(cx, cz, seed): readonly StructureBlock[] {
    const h = hash32(cx, cz, seed ^ 0x7117a9e) >>> 0;
    const yBase = 64 + (h % 6);
    const ox = cx * 16 + 4;
    const oz = cz * 16 + 4;
    const blocks: StructureBlock[] = [];
    for (let dx = 0; dx < 5; dx++) {
      for (let dz = 0; dz < 5; dz++) {
        for (let dy = 0; dy < 4; dy++) {
          const onEdge = dx === 0 || dx === 4 || dz === 0 || dz === 4;
          const onRoof = dy === 3;
          const isDoor = dy < 2 && dx === 2 && dz === 0;
          if (isDoor) continue;
          if (onEdge || onRoof) {
            blocks.push({
              pos: { x: ox + dx, y: yBase + dy, z: oz + dz },
              block: onRoof ? 'webmc:oak_planks' : 'webmc:cobblestone',
            });
          }
        }
      }
    }
    return blocks;
  },
};

// Stronghold marker: single end_portal_frame at a low, cave-depth anchor.
export const STRONGHOLD_MARKER: StructureTemplate = {
  name: 'stronghold_marker',
  chunkRadius: 1,
  generate(cx, cz): readonly StructureBlock[] {
    return [{ pos: { x: cx * 16 + 8, y: 24, z: cz * 16 + 8 }, block: 'webmc:end_portal_frame' }];
  },
};
