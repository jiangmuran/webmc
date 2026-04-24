const HEAD_SLOTS = new Set<string>([
  'leather_helmet',
  'chainmail_helmet',
  'iron_helmet',
  'golden_helmet',
  'diamond_helmet',
  'netherite_helmet',
  'turtle_helmet',
  'carved_pumpkin',
  'creeper_head',
  'dragon_head',
  'piglin_head',
  'player_head',
  'skeleton_skull',
  'wither_skeleton_skull',
  'zombie_head',
]);

export function isHeadWearable(id: string): boolean {
  return HEAD_SLOTS.has(id);
}

export function protectionFromHelmet(id: string): number {
  if (id === 'leather_helmet' || id === 'golden_helmet') return 1;
  if (id === 'chainmail_helmet' || id === 'iron_helmet' || id === 'turtle_helmet') return 2;
  if (id === 'diamond_helmet' || id === 'netherite_helmet') return 3;
  return 0;
}

export function conduitWaterBreathing(id: string): boolean {
  return id === 'turtle_helmet';
}
