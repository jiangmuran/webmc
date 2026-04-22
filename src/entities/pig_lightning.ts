// Lightning-induced mob transformations. Lightning striking within 4
// blocks of these mobs converts them:
//   pig → zombified piglin
//   creeper → charged creeper (see creeper_explosion.ts)
//   villager → witch
//   mooshroom red → mooshroom brown (and vice versa via lightning)
//   turtle → (no change, but shelter takes damage)

export interface LightningConversionResult {
  converted: boolean;
  newKind: string | null;
  keepEquipment: boolean;
}

export function onLightningStrike(
  mobKind: string,
  distanceFromBolt: number,
): LightningConversionResult {
  if (distanceFromBolt > 4) {
    return { converted: false, newKind: null, keepEquipment: false };
  }
  switch (mobKind) {
    case 'pig':
      return { converted: true, newKind: 'zombified_piglin', keepEquipment: false };
    case 'villager':
      return { converted: true, newKind: 'witch', keepEquipment: false };
    case 'mooshroom_red':
      return { converted: true, newKind: 'mooshroom_brown', keepEquipment: false };
    case 'mooshroom_brown':
      return { converted: true, newKind: 'mooshroom_red', keepEquipment: false };
    case 'creeper':
      return { converted: true, newKind: 'creeper_charged', keepEquipment: false };
    default:
      return { converted: false, newKind: null, keepEquipment: false };
  }
}

// A lightning bolt sets fire in a 1-block area + deals 5 damage. Tracks
// the bolt's lifetime (~0.5s = 10 ticks) for rendering + sound.
export interface LightningBolt {
  x: number;
  z: number;
  y: number;
  ageTicks: number;
  visualOnly: boolean; // triggered by trident with channeling — same visual, no fire
}

export const LIGHTNING_DAMAGE = 5;
export const LIGHTNING_LIFETIME_TICKS = 10;
export const LIGHTNING_FIRE_RADIUS = 1;

export function boltExpired(bolt: LightningBolt): boolean {
  return bolt.ageTicks >= LIGHTNING_LIFETIME_TICKS;
}
