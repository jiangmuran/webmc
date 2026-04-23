export type HeadKind =
  | 'player'
  | 'zombie'
  | 'skeleton'
  | 'wither_skeleton'
  | 'creeper'
  | 'dragon'
  | 'piglin';

export function wearableAs(kind: HeadKind): 'helmet' {
  void kind;
  return 'helmet';
}

export function witherSkullWeaponCraft(kind: HeadKind): boolean {
  return kind === 'wither_skeleton';
}

export function wearingCreeperHeadReducesCreeperDetection(kind: HeadKind): number {
  return kind === 'creeper' ? 0.5 : 1;
}
