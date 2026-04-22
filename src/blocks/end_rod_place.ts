// End rod placement + orientation. Placed against any face; the rod
// points away from that face. Light emission 14. End rods can be
// waterlogged. In the end dimension, they mark navigation points on
// end-city towers.

export type EndRodAxis = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface EndRodPlaceQuery {
  clickedFace: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west';
}

export function rodAxisFor(q: EndRodPlaceQuery): EndRodAxis {
  switch (q.clickedFace) {
    case 'top':
      return 'up';
    case 'bottom':
      return 'down';
    case 'north':
      return 'north';
    case 'south':
      return 'south';
    case 'east':
      return 'east';
    case 'west':
      return 'west';
  }
}

export const END_ROD_EMISSION = 14;

// End rods can be attached to another end rod without falling —
// unusual, but allowed in MC. Check: if target is an end_rod and the
// new rod's axis is perpendicular, OK.
export interface StackCheck {
  targetBlockId: string;
  targetAxis: EndRodAxis | null;
  newAxis: EndRodAxis;
}

export function canStackOn(q: StackCheck): boolean {
  if (q.targetBlockId !== 'webmc:end_rod') return true;
  if (!q.targetAxis) return true;
  // Parallel axes stack; perpendicular attaches by side.
  return true;
}

// Item model rotates with placement: vertical (up/down) shows the rod
// standing; horizontal shows it wall-mounted.
export function isVertical(axis: EndRodAxis): boolean {
  return axis === 'up' || axis === 'down';
}

// Craft: 4 popped chorus fruit + 1 blaze rod → 4 end rods.
export interface CraftEndRodQuery {
  poppedChorusFruit: number;
  blazeRod: number;
}

export function craftEndRod(q: CraftEndRodQuery): { item: 'webmc:end_rod'; count: 4 } | null {
  if (q.poppedChorusFruit < 4 || q.blazeRod < 1) return null;
  return { item: 'webmc:end_rod', count: 4 };
}
