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

export function beesAngered(s: BeehiveState, broken: boolean): boolean {
  if (s.isSmoked) return false;
  return broken || s.honeyLevel >= MAX_HONEY_LEVEL;
}
