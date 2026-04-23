// Cape flap physics. Cape trails behind based on velocity; bends
// toward resting when still. Simple 1-segment bend for MVP.

export interface CapeState {
  bendRadians: number;
  lastX: number;
  lastZ: number;
}

export function init(x: number, z: number): CapeState {
  return { bendRadians: 0, lastX: x, lastZ: z };
}

export const MAX_BEND = 1.3; // ~75°
export const REST_DECAY = 0.1;

export function tick(s: CapeState, nowX: number, nowZ: number, dtMs: number): CapeState {
  const dx = nowX - s.lastX;
  const dz = nowZ - s.lastZ;
  const speed = Math.hypot(dx, dz) / Math.max(0.001, dtMs / 1000);
  const desired = Math.min(MAX_BEND, speed * 0.2);
  const bend = s.bendRadians + (desired - s.bendRadians) * 0.3;
  return { bendRadians: bend, lastX: nowX, lastZ: nowZ };
}

export function settleToRest(s: CapeState): CapeState {
  return { ...s, bendRadians: s.bendRadians * (1 - REST_DECAY) };
}
