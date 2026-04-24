export const RAID_WARNING_RADIUS = 32;
export const RING_SOUND_RADIUS = 48;

export interface BellRingInput {
  bellX: number;
  bellY: number;
  bellZ: number;
}

export function entitiesHearing(
  ring: BellRingInput,
  entities: readonly { id: string; x: number; y: number; z: number }[],
): readonly string[] {
  return entities
    .filter(
      (e) => Math.hypot(e.x - ring.bellX, e.y - ring.bellY, e.z - ring.bellZ) <= RING_SOUND_RADIUS,
    )
    .map((e) => e.id);
}

export function raidersRevealed(
  ring: BellRingInput,
  raiders: readonly { id: string; x: number; y: number; z: number }[],
): readonly string[] {
  return raiders
    .filter(
      (r) =>
        Math.hypot(r.x - ring.bellX, r.y - ring.bellY, r.z - ring.bellZ) <= RAID_WARNING_RADIUS,
    )
    .map((r) => r.id);
}

export const GLOW_TICKS = 60;
