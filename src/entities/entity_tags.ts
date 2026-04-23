// Entity tag registry. Shared mechanics (undead, arthropod, etc.)

export interface EntityTagRegistry {
  tags: Record<string, Set<string>>;
}

export function makeEntityTags(): EntityTagRegistry {
  return { tags: {} };
}

export function tagEntity(r: EntityTagRegistry, tag: string, types: string[]): void {
  const existing = r.tags[tag] ?? new Set<string>();
  for (const t of types) existing.add(t);
  r.tags[tag] = existing;
}

export function hasTag(r: EntityTagRegistry, type: string, tag: string): boolean {
  return r.tags[tag]?.has(type) ?? false;
}

export function seedDefaults(r: EntityTagRegistry): void {
  tagEntity(r, 'undead', [
    'zombie',
    'skeleton',
    'husk',
    'stray',
    'drowned',
    'bogged',
    'wither_skeleton',
    'phantom',
    'zombified_piglin',
    'zoglin',
    'wither',
    'zombie_villager',
  ]);
  tagEntity(r, 'arthropod', ['spider', 'cave_spider', 'silverfish', 'endermite', 'bee']);
  tagEntity(r, 'aquatic', [
    'cod',
    'salmon',
    'squid',
    'glow_squid',
    'dolphin',
    'turtle',
    'guardian',
    'elder_guardian',
    'axolotl',
    'pufferfish',
    'tropical_fish',
    'tadpole',
  ]);
  tagEntity(r, 'illager', ['pillager', 'vindicator', 'evoker', 'illusioner', 'ravager']);
  tagEntity(r, 'villager_job_site_users', ['villager']);
  tagEntity(r, 'raiders', ['pillager', 'vindicator', 'evoker', 'witch', 'ravager']);
}
