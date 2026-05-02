export const MAX_HONEY_LEVEL = 5;

export interface BeehiveState {
  honeyLevel: number;
  beesHoused: number;
  isSmoked: boolean;
}

export function harvestHoneyBottle(s: BeehiveState): {
  newHive: BeehiveState;
  output?: 'honey_bottle';
} {
  if (s.honeyLevel < MAX_HONEY_LEVEL) return { newHive: s };
  return { newHive: { ...s, honeyLevel: 0 }, output: 'honey_bottle' };
}

export function harvestHoneycomb(s: BeehiveState): {
  newHive: BeehiveState;
  output?: readonly ['honeycomb', 'honeycomb', 'honeycomb'];
} {
  if (s.honeyLevel < MAX_HONEY_LEVEL) return { newHive: s };
  return { newHive: { ...s, honeyLevel: 0 }, output: ['honeycomb', 'honeycomb', 'honeycomb'] };
}

// Wiki (minecraft.wiki/w/Bee): "Bees become hostile when their hive is
// broken (without silk touch) or when honey is harvested without a
// campfire / smoke beneath the hive." A full but undisturbed hive does
// NOT anger bees on its own — old code returned true for any full
// hive, anger-spawning bees while the player just walked past. Keep
// `broken` as the single trigger here; sibling beehive_honey_harvest.ts
// already handles the harvest-without-smoke branch in `harvest`.
export function beesAngered(s: BeehiveState, broken: boolean): boolean {
  if (s.isSmoked) return false;
  return broken;
}
