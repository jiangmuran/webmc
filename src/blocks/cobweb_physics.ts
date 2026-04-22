// Cobweb physics. Entities inside a cobweb move at 15% speed horizontally
// and 5% vertically. Shears + swords break cobwebs in 0.4s; hand takes
// 20s (hardness 4).

export const COBWEB_HORIZONTAL_SPEED_MULT = 0.15;
export const COBWEB_VERTICAL_SPEED_MULT = 0.05;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function applyCobwebVelocity(velocity: Vec3, inWeb: boolean): Vec3 {
  if (!inWeb) return velocity;
  return {
    x: velocity.x * COBWEB_HORIZONTAL_SPEED_MULT,
    y: velocity.y * COBWEB_VERTICAL_SPEED_MULT,
    z: velocity.z * COBWEB_HORIZONTAL_SPEED_MULT,
  };
}

// Fall damage while in cobweb is zeroed: MC resets fallDistance each tick.
export function resetFallDistanceInWeb(inWeb: boolean, currentFallDistance: number): number {
  return inWeb ? 0 : currentFallDistance;
}

// Breaking speed: cobweb is hardness 4 with no tool family.
// Shears or swords are the "correct tool".
export type BreakTool = 'shears' | 'sword' | 'hand' | 'other';

export function cobwebBreakSeconds(tool: BreakTool): number {
  if (tool === 'shears') return 0.4;
  if (tool === 'sword') return 0.4;
  return 20;
}

// Drops: string if broken with sword; cobweb item if broken with shears.
export function cobwebDrops(tool: BreakTool): { item: string; count: number }[] {
  if (tool === 'shears') return [{ item: 'webmc:cobweb', count: 1 }];
  if (tool === 'sword') return [{ item: 'webmc:string', count: 1 }];
  return [{ item: 'webmc:string', count: Math.random() < 0.5 ? 1 : 0 }].filter((d) => d.count > 0);
}
