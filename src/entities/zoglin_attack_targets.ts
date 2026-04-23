export type MobKind =
  | 'player'
  | 'villager'
  | 'piglin'
  | 'zoglin'
  | 'zombie'
  | 'creeper';

export function isHostileToZoglin(mob: MobKind): boolean {
  return mob !== 'creeper' && mob !== 'zoglin';
}

export function knockbackStrength(): number {
  return 2.5;
}

export function canTargetInNether(): boolean {
  return true;
}
