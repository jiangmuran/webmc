export interface PhantomState {
  target: { x: number; y: number; z: number } | undefined;
  x: number;
  y: number;
  z: number;
  divingAngleRadians: number;
  circleRadius: number;
  inDiveMode: boolean;
}

export function updateOrbit(p: PhantomState, angleDelta: number): PhantomState {
  if (p.target === undefined) return p;
  const angle = p.divingAngleRadians + angleDelta;
  const targetY = p.inDiveMode ? p.target.y + 2 : p.target.y + 12 + 5 * Math.sin(angle);
  return {
    ...p,
    divingAngleRadians: angle,
    x: p.target.x + Math.cos(angle) * p.circleRadius,
    y: targetY,
    z: p.target.z + Math.sin(angle) * p.circleRadius,
  };
}

export function shouldDive(p: PhantomState, sleepSuppressed: boolean): boolean {
  if (p.target === undefined) return false;
  if (sleepSuppressed) return false;
  return Math.hypot(p.x - p.target.x, p.z - p.target.z) < p.circleRadius * 1.1;
}
