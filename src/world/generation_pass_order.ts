// Worldgen pass order. Each chunk goes through a pipeline of stages
// in order: base → surface → features → lighting → post_process.
// A chunk can't proceed to a stage until all neighbors (that stage
// requires) are at that stage.

export type Stage =
  | 'empty'
  | 'structure_starts'
  | 'structure_references'
  | 'biomes'
  | 'noise_base'
  | 'surface'
  | 'carvers'
  | 'liquid_carvers'
  | 'features'
  | 'initialize_light'
  | 'spawn'
  | 'full';

export const STAGES: Stage[] = [
  'empty',
  'structure_starts',
  'structure_references',
  'biomes',
  'noise_base',
  'surface',
  'carvers',
  'liquid_carvers',
  'features',
  'initialize_light',
  'spawn',
  'full',
];

// How many chunks around the target must be at least this stage before
// we can advance to (stage+1).
const NEIGHBOR_RADIUS: Record<Stage, number> = {
  empty: 0,
  structure_starts: 0,
  structure_references: 8,
  biomes: 0,
  noise_base: 0,
  surface: 0,
  carvers: 0,
  liquid_carvers: 0,
  features: 1,
  initialize_light: 0,
  spawn: 1,
  full: 0,
};

export function neighborRadius(s: Stage): number {
  return NEIGHBOR_RADIUS[s];
}

export function nextStage(s: Stage): Stage | null {
  const idx = STAGES.indexOf(s);
  if (idx < 0 || idx >= STAGES.length - 1) return null;
  return STAGES[idx + 1] ?? null;
}

export interface AdvanceQuery {
  self: Stage;
  neighborStages: Stage[];
}

export function canAdvance(q: AdvanceQuery): boolean {
  const needed = nextStage(q.self);
  if (needed === null) return false;
  const radius = NEIGHBOR_RADIUS[needed];
  if (radius === 0) return true;
  const required = STAGES.indexOf(needed) - 1;
  return q.neighborStages.every((ns) => STAGES.indexOf(ns) >= required);
}
