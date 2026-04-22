// Multishot (crossbow). Fires three projectiles per shot at a spread.
// Center arrow collides normally; outer two are visual-only on pickup.

export const MULTISHOT_EXTRA_ARROW_SPREAD_DEG = 10;

export interface MultishotShot {
  angles: number[]; // degrees from aim
  primary: number; // index of the pickupable arrow
}

export function fire(baseAimDeg: number, hasMultishot: boolean): MultishotShot {
  if (!hasMultishot) return { angles: [baseAimDeg], primary: 0 };
  return {
    angles: [
      baseAimDeg - MULTISHOT_EXTRA_ARROW_SPREAD_DEG,
      baseAimDeg,
      baseAimDeg + MULTISHOT_EXTRA_ARROW_SPREAD_DEG,
    ],
    primary: 1,
  };
}

export function consumesOneArrow(): boolean {
  return true;
}

export function incompatibleWith(): string[] {
  return ['piercing'];
}
