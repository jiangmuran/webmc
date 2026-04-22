// Dispenser behavior registry. Each item mapped to an action: launch as
// projectile, spawn entity, place block, apply bone meal, use on mob,
// or default "drop as entity". Items with no registered behavior drop
// in front of the dispenser.

export type DispenserAction =
  | { kind: 'projectile'; velocity: number }
  | { kind: 'spawn_mob'; mob: string }
  | { kind: 'place_block'; block: string }
  | { kind: 'bone_meal' }
  | { kind: 'use_on_mob'; effect: string }
  | { kind: 'shear' }
  | { kind: 'ignite' }
  | { kind: 'bucket_fill_or_empty' }
  | { kind: 'default_drop' };

const TABLE: Record<string, DispenserAction> = {
  'webmc:arrow': { kind: 'projectile', velocity: 1.1 },
  'webmc:spectral_arrow': { kind: 'projectile', velocity: 1.1 },
  'webmc:snowball': { kind: 'projectile', velocity: 1.5 },
  'webmc:egg': { kind: 'projectile', velocity: 1.5 },
  'webmc:ender_pearl': { kind: 'projectile', velocity: 1.5 },
  'webmc:splash_potion': { kind: 'projectile', velocity: 0.5 },
  'webmc:lingering_potion': { kind: 'projectile', velocity: 0.5 },
  'webmc:fire_charge': { kind: 'projectile', velocity: 1.0 },
  'webmc:wind_charge': { kind: 'projectile', velocity: 1.2 },
  'webmc:tnt': { kind: 'place_block', block: 'webmc:tnt' },
  'webmc:bone_meal': { kind: 'bone_meal' },
  'webmc:saddle': { kind: 'use_on_mob', effect: 'saddle' },
  'webmc:shears': { kind: 'shear' },
  'webmc:flint_and_steel': { kind: 'ignite' },
  'webmc:water_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:lava_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:milk_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:pufferfish_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:cod_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:salmon_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:tropical_fish_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:axolotl_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:tadpole_bucket': { kind: 'bucket_fill_or_empty' },
  'webmc:armor_stand': { kind: 'place_block', block: 'webmc:armor_stand' },
  'webmc:boat': { kind: 'place_block', block: 'webmc:boat' },
};

// Spawn eggs map to their mob kinds via a pattern.
export function actionFor(item: string): DispenserAction {
  if (TABLE[item]) return TABLE[item];
  if (item.endsWith('_spawn_egg')) {
    const mob = item.replace('webmc:', '').replace('_spawn_egg', '');
    return { kind: 'spawn_mob', mob };
  }
  return { kind: 'default_drop' };
}

export function registerBehavior(item: string, action: DispenserAction): void {
  TABLE[item] = action;
}
