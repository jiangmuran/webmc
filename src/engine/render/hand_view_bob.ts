export function handSwing(swingProgress: number): number {
  const p = Math.max(0, Math.min(1, swingProgress));
  return Math.sin(p * Math.PI);
}

export function handSwayXY(
  cameraPitchDeg: number,
  cameraYawDegDelta: number,
): { x: number; y: number } {
  return { x: cameraYawDegDelta * 0.01, y: cameraPitchDeg * 0.002 };
}

export function itemPositionOffset(itemKind: 'block' | 'sword' | 'tool'): { dx: number; dy: number; dz: number } {
  if (itemKind === 'block') return { dx: 0.56, dy: -0.52, dz: -0.72 };
  if (itemKind === 'sword') return { dx: 0.4, dy: -0.4, dz: -0.6 };
  return { dx: 0.45, dy: -0.45, dz: -0.7 };
}
