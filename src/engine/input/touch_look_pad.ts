export interface LookPadCtx {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  sensitivity: number;
}

export function yawPitchDelta(c: LookPadCtx): { yawDeg: number; pitchDeg: number } {
  const dx = c.currentX - c.startX;
  const dy = c.currentY - c.startY;
  return {
    yawDeg: dx * c.sensitivity,
    pitchDeg: dy * c.sensitivity,
  };
}

export function clampPitch(pitchDeg: number): number {
  return Math.max(-89.9, Math.min(89.9, pitchDeg));
}
