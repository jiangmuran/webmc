// Loading screen progress. Shows steps: "Loading world", "Streaming
// chunks", "Building meshes", "Warming render". Each step has a
// weighted portion of the total bar.

export type LoadStep = 'load_world' | 'stream_chunks' | 'build_meshes' | 'warm_render' | 'done';

export const WEIGHTS: Record<LoadStep, number> = {
  load_world: 0.1,
  stream_chunks: 0.4,
  build_meshes: 0.3,
  warm_render: 0.2,
  done: 0,
};

export const ORDER: LoadStep[] = [
  'load_world',
  'stream_chunks',
  'build_meshes',
  'warm_render',
  'done',
];

export interface LoadProgress {
  step: LoadStep;
  stepProgress: number; // 0..1
}

export function makeLoadProgress(): LoadProgress {
  return { step: 'load_world', stepProgress: 0 };
}

export function overallFraction(lp: LoadProgress): number {
  let acc = 0;
  for (const s of ORDER) {
    if (s === lp.step) return acc + WEIGHTS[s] * lp.stepProgress;
    acc += WEIGHTS[s];
  }
  return 1;
}

export function advance(lp: LoadProgress): boolean {
  const idx = ORDER.indexOf(lp.step);
  if (idx === -1 || idx >= ORDER.length - 1) return false;
  const next = ORDER[idx + 1];
  if (!next) return false;
  lp.step = next;
  lp.stepProgress = 0;
  return true;
}

export function setProgress(lp: LoadProgress, frac: number): void {
  lp.stepProgress = Math.max(0, Math.min(1, frac));
}
