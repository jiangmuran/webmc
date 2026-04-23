export interface MoveCheck {
  prevX: number;
  prevY: number;
  prevZ: number;
  nextX: number;
  nextY: number;
  nextZ: number;
  dtMs: number;
  maxSpeed: number;
}

export function isTeleport(m: MoveCheck): boolean {
  const dt = m.dtMs / 1000;
  if (dt <= 0) return false;
  const d = Math.hypot(m.nextX - m.prevX, m.nextY - m.prevY, m.nextZ - m.prevZ);
  const speed = d / dt;
  return speed > m.maxSpeed * 1.5;
}

export function flagSeverity(m: MoveCheck): number {
  const dt = Math.max(0.001, m.dtMs / 1000);
  const d = Math.hypot(m.nextX - m.prevX, m.nextY - m.prevY, m.nextZ - m.prevZ);
  const speed = d / dt;
  return Math.max(0, speed - m.maxSpeed);
}

export function correctionVector(m: MoveCheck): {
  x: number;
  y: number;
  z: number;
} {
  return { x: m.prevX, y: m.prevY, z: m.prevZ };
}
