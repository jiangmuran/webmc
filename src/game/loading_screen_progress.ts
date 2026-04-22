// Loading screen stages when joining a world. Progress 0..1.

export type LoadStage = 'init' | 'world' | 'terrain' | 'light' | 'entities' | 'ready';

const STAGE_WEIGHT: Record<LoadStage, number> = {
  init: 0.05,
  world: 0.15,
  terrain: 0.45,
  light: 0.15,
  entities: 0.15,
  ready: 0.05,
};

export function overallProgress(currentStage: LoadStage, stageProgress: number): number {
  const stages: LoadStage[] = ['init', 'world', 'terrain', 'light', 'entities', 'ready'];
  let total = 0;
  for (const s of stages) {
    if (s === currentStage) {
      total += STAGE_WEIGHT[s] * Math.max(0, Math.min(1, stageProgress));
      break;
    }
    total += STAGE_WEIGHT[s];
  }
  return Math.min(1, total);
}

export function isReady(stage: LoadStage): boolean {
  return stage === 'ready';
}
