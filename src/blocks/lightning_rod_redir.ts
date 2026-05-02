// Lightning rod diverts thunderstorm strikes within a spherical
// range. Grounded rods emit a 15-signal pulse on strike.
//
// Wiki (minecraft.wiki/w/Lightning_Rod): "Lightning rods that are
// the highest block in the column redirect lightning strikes within
// a spherical volume, having a radius of 128 blocks in Java Edition
// and 64 blocks in Bedrock Edition." webmc targets Java per
// AGENT_CHARTER → 128 spherical.
//
// Old code used a 32-radius cylinder (32 horizontal × 32 vertical),
// 4× under wiki canon and using cylinder geometry instead of sphere.
// A storm strike 50 blocks from a rod (well within wiki's 128-sphere)
// went unredirected. Sibling lightning_rod.ts already uses
// ATTRACT_RADIUS = 128 sphere; this module now matches.

export interface RodQuery {
  rodPos: { x: number; y: number; z: number };
  strikePos: { x: number; y: number; z: number };
  dim: 'overworld' | 'nether' | 'end';
}

export const DIVERT_RADIUS = 128;
/** @deprecated wiki uses spherical not cylindrical; kept for back-compat. */
export const DIVERT_HEIGHT = 128;

export function divertsStrike(q: RodQuery): boolean {
  if (q.dim !== 'overworld') return false;
  const dx = q.rodPos.x - q.strikePos.x;
  const dz = q.rodPos.z - q.strikePos.z;
  const dy = q.rodPos.y - q.strikePos.y;
  // Spherical check: sqrt(dx² + dy² + dz²) ≤ DIVERT_RADIUS.
  return dx * dx + dy * dy + dz * dz <= DIVERT_RADIUS * DIVERT_RADIUS;
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
