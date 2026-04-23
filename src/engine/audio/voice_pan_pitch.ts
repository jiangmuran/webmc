export interface PanPitchCtx {
  listenerX: number;
  listenerY: number;
  listenerZ: number;
  listenerYaw: number;
  sourceX: number;
  sourceY: number;
  sourceZ: number;
  pitchShift: number;
}

export function pan(c: PanPitchCtx): number {
  const dx = c.sourceX - c.listenerX;
  const dz = c.sourceZ - c.listenerZ;
  const angle = Math.atan2(dx, -dz);
  const rel = angle - c.listenerYaw;
  return Math.max(-1, Math.min(1, Math.sin(rel)));
}

export function pitch(c: PanPitchCtx): number {
  return Math.max(0.5, Math.min(2, c.pitchShift));
}
