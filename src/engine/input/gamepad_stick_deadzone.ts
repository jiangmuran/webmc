export const STICK_INNER_DEADZONE = 0.2;
export const STICK_OUTER_DEADZONE = 0.95;

export function cleanStick(x: number, y: number): { x: number; y: number } {
  const mag = Math.hypot(x, y);
  if (mag < STICK_INNER_DEADZONE) return { x: 0, y: 0 };
  const clamped = Math.min(1, mag);
  const outer = clamped >= STICK_OUTER_DEADZONE ? 1 : clamped;
  const rescaled = (outer - STICK_INNER_DEADZONE) / (1 - STICK_INNER_DEADZONE);
  const scale = rescaled / mag;
  return { x: x * scale, y: y * scale };
}

export function triggerWithThreshold(pressure: number, threshold = 0.5): boolean {
  return pressure >= threshold;
}
