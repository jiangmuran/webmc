// Village bell alarm. When rung, nearby villagers flee to doors +
// raiders become glowing for N ticks.

export const BELL_RADIUS = 32;
export const RAIDER_GLOW_TICKS = 60;

export interface BellEvent {
  centerX: number;
  centerZ: number;
  rungByPlayer: boolean;
}

export function nearbyVillagers(
  e: BellEvent,
  villagers: { x: number; z: number; id: string }[],
): string[] {
  return villagers
    .filter((v) => Math.hypot(v.x - e.centerX, v.z - e.centerZ) <= BELL_RADIUS)
    .map((v) => v.id);
}

export function nearbyRaiders(
  e: BellEvent,
  raiders: { x: number; z: number; id: string }[],
): string[] {
  return raiders
    .filter((r) => Math.hypot(r.x - e.centerX, r.z - e.centerZ) <= BELL_RADIUS)
    .map((r) => r.id);
}

export function glowsRaidersFor(): number {
  return RAIDER_GLOW_TICKS;
}
