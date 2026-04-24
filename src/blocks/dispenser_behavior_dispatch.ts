export type DispenseAction =
  | 'place_block'
  | 'drop_item'
  | 'ignite_fire'
  | 'shoot_arrow'
  | 'throw_splash_potion'
  | 'launch_firework'
  | 'pour_bucket'
  | 'fill_bucket'
  | 'shear_sheep'
  | 'use_tnt'
  | 'none';

export function behaviorFor(itemId: string): DispenseAction {
  if (itemId === 'arrow' || itemId === 'spectral_arrow' || itemId === 'tipped_arrow')
    return 'shoot_arrow';
  if (itemId === 'flint_and_steel') return 'ignite_fire';
  if (itemId === 'splash_potion' || itemId === 'lingering_potion') return 'throw_splash_potion';
  if (itemId === 'firework_rocket') return 'launch_firework';
  if (itemId === 'water_bucket' || itemId === 'lava_bucket') return 'pour_bucket';
  if (itemId === 'bucket') return 'fill_bucket';
  if (itemId === 'shears') return 'shear_sheep';
  if (itemId === 'tnt') return 'use_tnt';
  if (
    ['wheat_seeds', 'carrot', 'potato', 'beetroot_seeds', 'pumpkin_seeds', 'melon_seeds'].includes(
      itemId,
    )
  )
    return 'drop_item';
  return 'place_block';
}
