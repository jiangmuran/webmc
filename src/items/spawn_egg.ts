// Spawn egg items. Resolves a spawn-egg item name to its mob kind so the
// interaction controller can dispatch to MobWorld.spawn on right-click.
// Also provides a per-mob "natural color" for any UI that wants to tint
// the egg icon.

import type { MobKind } from '@/entities/mob';

export interface SpawnEggDef {
  itemName: string;
  mobKind: MobKind;
  baseColor: readonly [number, number, number];
  spotColor: readonly [number, number, number];
}

export const SPAWN_EGGS: readonly SpawnEggDef[] = [
  {
    itemName: 'webmc:pig_spawn_egg',
    mobKind: 'pig',
    baseColor: [240, 178, 178],
    spotColor: [217, 105, 129],
  },
  {
    itemName: 'webmc:cow_spawn_egg',
    mobKind: 'cow',
    baseColor: [68, 48, 32],
    spotColor: [255, 240, 220],
  },
  {
    itemName: 'webmc:sheep_spawn_egg',
    mobKind: 'sheep',
    baseColor: [235, 235, 235],
    spotColor: [240, 200, 210],
  },
  {
    itemName: 'webmc:chicken_spawn_egg',
    mobKind: 'chicken',
    baseColor: [160, 80, 32],
    spotColor: [240, 160, 65],
  },
  {
    itemName: 'webmc:wolf_spawn_egg',
    mobKind: 'wolf',
    baseColor: [210, 210, 210],
    spotColor: [230, 220, 190],
  },
  {
    itemName: 'webmc:zombie_spawn_egg',
    mobKind: 'zombie',
    baseColor: [0, 175, 175],
    spotColor: [85, 110, 60],
  },
  {
    itemName: 'webmc:skeleton_spawn_egg',
    mobKind: 'skeleton',
    baseColor: [200, 200, 200],
    spotColor: [85, 85, 85],
  },
  {
    itemName: 'webmc:creeper_spawn_egg',
    mobKind: 'creeper',
    baseColor: [40, 175, 80],
    spotColor: [0, 128, 0],
  },
  {
    itemName: 'webmc:spider_spawn_egg',
    mobKind: 'spider',
    baseColor: [60, 35, 20],
    spotColor: [200, 20, 20],
  },
  {
    itemName: 'webmc:enderman_spawn_egg',
    mobKind: 'enderman',
    baseColor: [20, 20, 20],
    spotColor: [130, 50, 240],
  },
  {
    itemName: 'webmc:ghast_spawn_egg',
    mobKind: 'ghast',
    baseColor: [240, 240, 250],
    spotColor: [210, 150, 150],
  },
  {
    itemName: 'webmc:blaze_spawn_egg',
    mobKind: 'blaze',
    baseColor: [240, 170, 60],
    spotColor: [240, 210, 80],
  },
  {
    itemName: 'webmc:piglin_spawn_egg',
    mobKind: 'piglin',
    baseColor: [230, 150, 120],
    spotColor: [180, 110, 80],
  },
  {
    itemName: 'webmc:wither_skeleton_spawn_egg',
    mobKind: 'wither_skeleton',
    baseColor: [30, 30, 30],
    spotColor: [10, 10, 10],
  },
  {
    itemName: 'webmc:axolotl_spawn_egg',
    mobKind: 'axolotl',
    baseColor: [250, 180, 210],
    spotColor: [140, 20, 80],
  },
  {
    itemName: 'webmc:frog_spawn_egg',
    mobKind: 'frog',
    baseColor: [125, 175, 80],
    spotColor: [85, 120, 60],
  },
  {
    itemName: 'webmc:bee_spawn_egg',
    mobKind: 'bee',
    baseColor: [240, 200, 70],
    spotColor: [50, 50, 50],
  },
  {
    itemName: 'webmc:warden_spawn_egg',
    mobKind: 'warden',
    baseColor: [18, 60, 60],
    spotColor: [6, 30, 32],
  },
  {
    itemName: 'webmc:fox_spawn_egg',
    mobKind: 'fox',
    baseColor: [220, 145, 75],
    spotColor: [150, 90, 50],
  },
  {
    itemName: 'webmc:goat_spawn_egg',
    mobKind: 'goat',
    baseColor: [200, 185, 160],
    spotColor: [75, 75, 75],
  },
  {
    itemName: 'webmc:horse_spawn_egg',
    mobKind: 'horse',
    baseColor: [196, 130, 85],
    spotColor: [75, 45, 20],
  },
  {
    itemName: 'webmc:rabbit_spawn_egg',
    mobKind: 'rabbit',
    baseColor: [190, 160, 115],
    spotColor: [150, 115, 85],
  },
  {
    itemName: 'webmc:squid_spawn_egg',
    mobKind: 'squid',
    baseColor: [35, 45, 85],
    spotColor: [70, 70, 90],
  },
  {
    itemName: 'webmc:cat_spawn_egg',
    mobKind: 'cat',
    baseColor: [215, 180, 130],
    spotColor: [115, 75, 45],
  },
  {
    itemName: 'webmc:parrot_spawn_egg',
    mobKind: 'parrot',
    baseColor: [75, 175, 255],
    spotColor: [255, 200, 60],
  },
];

export function spawnEggFor(itemName: string): SpawnEggDef | null {
  for (const e of SPAWN_EGGS) if (e.itemName === itemName) return e;
  return null;
}

export function mobKindFromEgg(itemName: string): MobKind | null {
  return spawnEggFor(itemName)?.mobKind ?? null;
}
