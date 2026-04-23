export interface Raider {
  x: number;
  z: number;
  isRaider: boolean;
}

export const HIGHLIGHT_RADIUS = 48;

export function raidersHighlighted(bellX: number, bellZ: number, entities: Raider[]): Raider[] {
  return entities.filter(
    (e) => e.isRaider && Math.hypot(e.x - bellX, e.z - bellZ) <= HIGHLIGHT_RADIUS,
  );
}

export function highlightDurationTicks(): number {
  return 60;
}
