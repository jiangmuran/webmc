// Amethyst geode. A spherical cavity (~8 block radius) with 3 concentric
// shells: outer smooth basalt, middle calcite, inner amethyst blocks.
// The innermost cavity contains budding amethyst and amethyst clusters
// on the inner surface.

export type GeodeShell =
  | 'smooth_basalt'
  | 'calcite'
  | 'amethyst_block'
  | 'budding_amethyst'
  | 'amethyst_cluster'
  | 'hollow';

export interface GeodeLayout {
  center: { x: number; y: number; z: number };
  outerRadius: number;
  calciteRadius: number;
  amethystRadius: number;
  hollowRadius: number;
  buddingCount: number;
}

export interface GeodeQuery {
  center: { x: number; y: number; z: number };
  rng: () => number;
}

export function planGeode(q: GeodeQuery): GeodeLayout {
  const outer = 8 + Math.floor(q.rng() * 2); // 8 or 9
  return {
    center: { ...q.center },
    outerRadius: outer,
    calciteRadius: outer - 1,
    amethystRadius: outer - 2,
    hollowRadius: outer - 3,
    buddingCount: 1 + Math.floor(q.rng() * 4), // 1..4 budding patches
  };
}

// Which shell a particular radius falls into.
export function shellAtRadius(r: number, layout: GeodeLayout): GeodeShell {
  if (r <= layout.hollowRadius) return 'hollow';
  if (r <= layout.amethystRadius) return 'amethyst_block';
  if (r <= layout.calciteRadius) return 'calcite';
  if (r <= layout.outerRadius) return 'smooth_basalt';
  return 'hollow';
}

// Growth stage of amethyst clusters: small_bud → medium_bud → large_bud →
// cluster. Progresses on random tick with ~1/64 probability per tick
// when attached to budding amethyst.
export type ClusterStage = 'small_bud' | 'medium_bud' | 'large_bud' | 'cluster';

const STAGES: readonly ClusterStage[] = ['small_bud', 'medium_bud', 'large_bud', 'cluster'];

export function advanceCluster(cur: ClusterStage, roll: number): ClusterStage {
  if (roll >= 1 / 64) return cur;
  const idx = STAGES.indexOf(cur);
  if (idx < 0 || idx >= STAGES.length - 1) return cur;
  return STAGES[idx + 1] ?? cur;
}

// Wiki (minecraft.wiki/w/Amethyst_Cluster): "Mining a cluster drops
// 4 amethyst shards. Fortune uses the standard discrete-ore formula:
//   probability of no bonus: 2 / (level + 2)
//   otherwise: equal chance for any multiplier from 2 to (level + 1).
// Fortune III gives an average of 8.8 shards per cluster (~2.2× base
// 4)."
//
// Old `bonus = floor(rand * (fortune + 1))` produced 0-3 bonus at
// Fortune III (total 4-7), about 32% of the wiki's 4-16. Sibling
// blocks/amethyst_crystal_growth.ts already uses the canonical
// multiplier formula.
export interface ClusterBreakQuery {
  stage: ClusterStage;
  silkTouch: boolean;
  fortune: number;
  rand?: () => number;
}

export function clusterDrops(q: ClusterBreakQuery): { item: string; count: number }[] {
  if (q.silkTouch) {
    return [{ item: `webmc:${q.stage}`, count: 1 }];
  }
  if (q.stage !== 'cluster') return [];
  const base = 4;
  if (q.fortune <= 0) return [{ item: 'webmc:amethyst_shard', count: base }];
  const rand = q.rand ?? Math.random;
  const roll = Math.floor(rand() * (q.fortune + 2)) - 1;
  const multiplier = Math.max(1, roll + 1);
  return [{ item: 'webmc:amethyst_shard', count: base * multiplier }];
}
