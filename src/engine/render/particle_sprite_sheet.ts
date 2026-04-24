export interface ParticleAnimation {
  frames: number;
  frameDurationTicks: number;
  loops: boolean;
}

export function frameIndexFor(anim: ParticleAnimation, elapsedTicks: number): number {
  const totalDuration = anim.frames * anim.frameDurationTicks;
  if (totalDuration <= 0) return 0;
  if (!anim.loops && elapsedTicks >= totalDuration) return anim.frames - 1;
  return Math.floor((elapsedTicks % totalDuration) / anim.frameDurationTicks);
}

export function uvForFrame(
  frameIndex: number,
  tileSize: number,
  sheetSize: number,
): { u: number; v: number; size: number } {
  const perRow = Math.floor(sheetSize / tileSize);
  const col = frameIndex % perRow;
  const row = Math.floor(frameIndex / perRow);
  return {
    u: (col * tileSize) / sheetSize,
    v: (row * tileSize) / sheetSize,
    size: tileSize / sheetSize,
  };
}
