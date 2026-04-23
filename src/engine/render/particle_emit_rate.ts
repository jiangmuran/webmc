export interface EmitCtx {
  source: string;
  intensity: number;
  distanceFromCamera: number;
}

export const MAX_DRAW_DISTANCE = 32;

export function emitRate(c: EmitCtx): number {
  if (c.distanceFromCamera > MAX_DRAW_DISTANCE) return 0;
  const falloff = 1 - c.distanceFromCamera / MAX_DRAW_DISTANCE;
  return Math.max(0, c.intensity * falloff);
}

export function particlesPerSecond(c: EmitCtx): number {
  return emitRate(c) * 20;
}
