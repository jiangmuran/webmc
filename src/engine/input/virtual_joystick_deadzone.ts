export const DEADZONE_RADIUS = 0.15;
export const MAX_RADIUS = 1;

export interface JoystickInput {
  x: number;
  y: number;
}

export function applyDeadzone(i: JoystickInput): JoystickInput {
  const mag = Math.hypot(i.x, i.y);
  if (mag < DEADZONE_RADIUS) return { x: 0, y: 0 };
  const clamped = Math.min(MAX_RADIUS, mag);
  const normalized = (clamped - DEADZONE_RADIUS) / (MAX_RADIUS - DEADZONE_RADIUS);
  const scale = normalized / mag;
  return { x: i.x * scale, y: i.y * scale };
}

export function magnitude(i: JoystickInput): number {
  return Math.hypot(i.x, i.y);
}
