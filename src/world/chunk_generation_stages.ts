// Chunk generation pipeline. A chunk advances through a fixed sequence
// of stages: empty → structure_starts → biomes → noise → surface →
// carvers → features → initialize_light → light → spawn → full. Each
// stage may depend on neighboring chunks having reached a prior stage.

export type ChunkStage =
  | 'empty'
  | 'structure_starts'
  | 'biomes'
  | 'noise'
  | 'surface'
  | 'carvers'
  | 'features'
  | 'initialize_light'
  | 'light'
  | 'spawn'
  | 'full';

export const STAGE_ORDER: readonly ChunkStage[] = [
  'empty',
  'structure_starts',
  'biomes',
  'noise',
  'surface',
  'carvers',
  'features',
  'initialize_light',
  'light',
  'spawn',
  'full',
];

// Radius of "neighbor dependency": a chunk advancing to stage X requires
// its 8 neighbors to be at least stage PRIOR. Structures need the widest
// neighborhood (they span multiple chunks).
const NEIGHBOR_PRE_REQ: Record<ChunkStage, number> = {
  empty: 0,
  structure_starts: 0,
  biomes: 0,
  noise: 0,
  surface: 0,
  carvers: 1, // needs 1-chunk neighbor to do noise first
  features: 1, // trees cross chunk boundaries
  initialize_light: 1,
  light: 1,
  spawn: 0,
  full: 0,
};

export function neighborRadiusFor(stage: ChunkStage): number {
  return NEIGHBOR_PRE_REQ[stage];
}

export function stageIndex(stage: ChunkStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function nextStage(stage: ChunkStage): ChunkStage | null {
  const i = stageIndex(stage);
  if (i < 0 || i >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[i + 1] ?? null;
}

export function isComplete(stage: ChunkStage): boolean {
  return stage === 'full';
}

// Scheduler: given the per-chunk current stages (map key "cx,cz" → stage),
// return the next chunk-stage step to execute. Picks the chunk closest
// to the origin that's ready to advance.
export interface Vec2 {
  cx: number;
  cz: number;
}

export interface SchedulerQuery {
  stages: ReadonlyMap<string, ChunkStage>;
  origin: Vec2;
}

export interface ScheduledStep {
  at: Vec2;
  from: ChunkStage;
  to: ChunkStage;
}

function key(c: Vec2): string {
  return `${c.cx.toString()},${c.cz.toString()}`;
}

export function pickNextStep(q: SchedulerQuery): ScheduledStep | null {
  let best: ScheduledStep | null = null;
  let bestDist = Infinity;
  for (const [k, current] of q.stages) {
    if (isComplete(current)) continue;
    const next = nextStage(current);
    if (!next) continue;
    const parts = k.split(',').map(Number);
    const cx = parts[0] ?? 0;
    const cz = parts[1] ?? 0;
    const radius = neighborRadiusFor(next);
    if (!neighborsReady({ cx, cz }, current, radius, q.stages)) continue;
    const dist = Math.hypot(cx - q.origin.cx, cz - q.origin.cz);
    if (dist < bestDist) {
      bestDist = dist;
      best = { at: { cx, cz }, from: current, to: next };
    }
  }
  return best;
}

function neighborsReady(
  at: Vec2,
  minStage: ChunkStage,
  radius: number,
  stages: ReadonlyMap<string, ChunkStage>,
): boolean {
  if (radius === 0) return true;
  const minIdx = stageIndex(minStage);
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      if (dx === 0 && dz === 0) continue;
      const nb = stages.get(key({ cx: at.cx + dx, cz: at.cz + dz }));
      if (!nb || stageIndex(nb) < minIdx) return false;
    }
  }
  return true;
}
