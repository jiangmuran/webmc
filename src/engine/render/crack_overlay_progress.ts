export const CRACK_STAGES = 10;

export function crackStage(progress01: number): number {
  const clamped = Math.max(0, Math.min(1, progress01));
  if (clamped === 0) return -1;
  if (clamped >= 1) return CRACK_STAGES - 1;
  return Math.floor(clamped * CRACK_STAGES);
}

export function crackTextureId(stage: number): string | undefined {
  if (stage < 0) return undefined;
  return `block.destroy_${Math.min(CRACK_STAGES - 1, stage)}`;
}
