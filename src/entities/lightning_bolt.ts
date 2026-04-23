export const DAMAGE_DIRECT = 5;
export const FIRE_SECONDS = 8;
export const IGNITION_RADIUS = 3;

export function damageAt(distance: number): number {
  if (distance <= 0) return DAMAGE_DIRECT;
  if (distance <= IGNITION_RADIUS) return 3;
  return 0;
}

export function setsFire(distance: number): boolean {
  return distance <= IGNITION_RADIUS;
}

export function convertsTargetOnStrike(target: string): string | undefined {
  switch (target) {
    case 'pig':
      return 'zombified_piglin';
    case 'creeper':
      return 'charged_creeper';
    case 'villager':
      return 'witch';
    case 'mooshroom':
      return 'mooshroom_other_variant';
  }
  return undefined;
}
