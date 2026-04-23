export function spawnsEntityType(eggId: string): string | undefined {
  const match = /^(\w+)_spawn_egg$/.exec(eggId);
  return match?.[1];
}

export function isSpawnEgg(id: string): boolean {
  return id.endsWith('_spawn_egg');
}

export function suppressedInDimension(entity: string, dim: string): boolean {
  if (dim === 'nether') return entity === 'snow_golem' || entity === 'mooshroom';
  if (dim === 'the_end') return entity === 'villager';
  return false;
}
