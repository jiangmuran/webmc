// Carved pumpkin / mob head as helmet. Wearing a carved pumpkin blocks
// enderman aggro. Wearing a mob skull reduces that mob's detection by
// 50%.

export type Headwear =
  | 'carved_pumpkin'
  | 'zombie_head'
  | 'skeleton_skull'
  | 'wither_skull'
  | 'creeper_head'
  | 'player_head'
  | 'dragon_head'
  | null;

export interface DetectionQuery {
  wornHead: Headwear;
  mobType: 'enderman' | 'zombie' | 'skeleton' | 'creeper' | 'other';
}

// Range multiplier for detection: 1.0 = normal, 0.5 = halved.
export function detectionRangeMultiplier(q: DetectionQuery): number {
  if (q.wornHead === 'carved_pumpkin' && q.mobType === 'enderman') return 0;
  if (q.wornHead === 'zombie_head' && q.mobType === 'zombie') return 0.5;
  if (q.wornHead === 'skeleton_skull' && q.mobType === 'skeleton') return 0.5;
  if (q.wornHead === 'creeper_head' && q.mobType === 'creeper') return 0.5;
  return 1.0;
}

// Pumpkin obscures vision: a pumpkin overlay in first-person view.
export function hasPumpkinOverlay(h: Headwear): boolean {
  return h === 'carved_pumpkin';
}

// Player head drops on kill by charged creeper.
export function chargedCreeperDrop(mobType: string): string | null {
  switch (mobType) {
    case 'zombie':
      return 'webmc:zombie_head';
    case 'skeleton':
      return 'webmc:skeleton_skull';
    case 'wither_skeleton':
      return 'webmc:wither_skeleton_skull';
    case 'creeper':
      return 'webmc:creeper_head';
    default:
      return null;
  }
}
