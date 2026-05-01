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

// Wiki (minecraft.wiki/w/Dispenser): "Items that are not handled
// by a custom behavior are simply launched as item entities." The
// default action is drop_item, NOT place_block. Old default was
// `place_block`, so a dispenser loaded with e.g. stone, diamond,
// or any non-special item silently tried to PLACE the item as a
// block in front of it — wiki says nothing of the sort happens
// for arbitrary items. Only TNT is placed via use_tnt.
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
  return 'drop_item';
}
