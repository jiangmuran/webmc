const SADDLEABLE = new Set<string>([
  'pig',
  'horse',
  'donkey',
  'mule',
  'strider',
  'camel',
  'skeleton_horse',
  'zombie_horse',
]);

export function canSaddle(mob: string): boolean {
  return SADDLEABLE.has(mob);
}

export function removeByShears(
  mob: string,
  hasSaddle: boolean,
): { removedItem?: string; mobStateUpdate: { hasSaddle: boolean } } {
  if (!canSaddle(mob) || !hasSaddle) return { mobStateUpdate: { hasSaddle } };
  return { removedItem: 'saddle', mobStateUpdate: { hasSaddle: false } };
}

export function dropsOnDeath(mob: string, hasSaddle: boolean): readonly string[] {
  if (!canSaddle(mob)) return [];
  return hasSaddle ? ['saddle'] : [];
}
