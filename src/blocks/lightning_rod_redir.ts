// Lightning rod diverts thunderstorm strikes within a cylindrical
// range. Grounded rods emit a 15-signal pulse on strike.

export interface RodQuery {
  rodPos: { x: number; y: number; z: number };
  strikePos: { x: number; y: number; z: number };
  dim: 'overworld' | 'nether' | 'end';
}

export const DIVERT_RADIUS = 32;
export const DIVERT_HEIGHT = 32;

export function divertsStrike(q: RodQuery): boolean {
  if (q.dim !== 'overworld') return false;
  const dx = q.rodPos.x - q.strikePos.x;
  const dz = q.rodPos.z - q.strikePos.z;
  const dy = q.rodPos.y - q.strikePos.y;
  if (Math.sqrt(dx * dx + dz * dz) > DIVERT_RADIUS) return false;
  if (Math.abs(dy) > DIVERT_HEIGHT) return false;
  return true;
}

// Signal pulse after strike: 15 for 8 ticks.
export const SIGNAL_TICKS = 8;

export interface RodState {
  poweredUntilTick: number;
}

export function strikeRod(s: RodState, nowTick: number): void {
  s.poweredUntilTick = nowTick + SIGNAL_TICKS;
}

export function redstoneOutput(s: RodState, nowTick: number): number {
  return nowTick < s.poweredUntilTick ? 15 : 0;
}

// Copper oxidation: rods stop diverting when heavily oxidized? No —
// they still divert regardless of oxidation state, but aesthetic.
