export interface BeeCtx {
  hasPollen: boolean;
  nearbyFlowerBlock?: string;
  nearbyHive?: boolean;
}

// Wiki (minecraft.wiki/w/Bee#Pollinating): "Bees ... are attracted to
// flowers (except closed eyeblossoms), flowering azaleas, flowering
// azalea leaves, mangrove propagules, pink petals, cherry leaves,
// spore blossoms, chorus flowers, cactus flowers, and wildflowers,
// which are the valid plants for the bee to gather nectar from. Bees
// can gather nectar from wither roses but receive the wither effect."
//
// Old list omitted half of the small flowers (4 tulips + azure bluet),
// both 1.16 tall flowers (lilac, peony), every non-flower nectar
// source the wiki names (pink petals, spore blossom, etc.), and the
// wither rose (which bees DO target, even at the cost of dying). A
// bee with the old list would simply ignore an azure_bluet field.
export const FLOWERS = new Set([
  'dandelion',
  'poppy',
  'torchflower',
  'allium',
  'azure_bluet',
  'blue_orchid',
  'cornflower',
  'lily_of_the_valley',
  'oxeye_daisy',
  'red_tulip',
  'orange_tulip',
  'white_tulip',
  'pink_tulip',
  'wither_rose',
  // Tall flowers
  'sunflower',
  'rose_bush',
  'lilac',
  'peony',
  'pitcher_plant',
  // Non-flower nectar sources per wiki
  'flowering_azalea',
  'flowering_azalea_leaves',
  'mangrove_propagule',
  'pink_petals',
  'cherry_leaves',
  'spore_blossom',
  'chorus_flower',
  'cactus_flower',
  'wildflowers',
  'open_eyeblossom',
]);

export function wantsToVisitFlower(b: BeeCtx): boolean {
  return !b.hasPollen && b.nearbyFlowerBlock !== undefined && FLOWERS.has(b.nearbyFlowerBlock);
}

export function wantsToReturnHome(b: BeeCtx): boolean {
  return b.hasPollen && b.nearbyHive === true;
}
