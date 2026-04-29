export interface Raider {
  x: number;
  z: number;
  isRaider: boolean;
}

// Wiki: bell rings highlight illagers within 32 blocks horizontally
// (and 4 vertical). Was 48 — matches bell_ring_radius.RING_SOUND_RADIUS
// but that's the audio range, not the highlight range. The
// bell_resonate module had 32 correctly.
export const HIGHLIGHT_RADIUS = 32;

export function raidersHighlighted(bellX: number, bellZ: number, entities: Raider[]): Raider[] {
  return entities.filter(
    (e) => e.isRaider && Math.hypot(e.x - bellX, e.z - bellZ) <= HIGHLIGHT_RADIUS,
  );
}

export function highlightDurationTicks(): number {
  return 60;
}
