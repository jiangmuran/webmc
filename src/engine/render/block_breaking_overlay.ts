export const BREAK_STAGES = 10;

export function stageForProgress(progress: number): number {
  if (progress <= 0) return -1;
  if (progress >= 1) return BREAK_STAGES - 1;
  return Math.floor(progress * BREAK_STAGES);
}

export function textureIdForStage(stage: number): string | undefined {
  if (stage < 0 || stage >= BREAK_STAGES) return undefined;
  return `block/destroy_stage_${stage.toString()}`;
}
