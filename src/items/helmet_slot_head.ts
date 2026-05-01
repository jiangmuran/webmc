// Wiki (minecraft.wiki/w/Turtle_Shell): "Java ID: turtle_helmet,
// Bedrock ID: turtle_shell". Webmc's main.ts registers it as
// `webmc:turtle_shell` for legacy reasons (item display name "Turtle
// Shell"); helmet_slot_head accepts BOTH so the head slot resolves
// regardless of which spelling the caller passes. Same dual-naming
// pattern applied for `gold_*` (webmc registry) vs `golden_*` (vanilla
// Java ID).
const HEAD_SLOTS = new Set<string>([
  'leather_helmet',
  'chainmail_helmet',
  'iron_helmet',
  'gold_helmet',
  'golden_helmet',
  'diamond_helmet',
  'netherite_helmet',
  'turtle_helmet',
  'turtle_shell',
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
  if (id === 'leather_helmet' || id === 'gold_helmet' || id === 'golden_helmet') return 1;
  if (
    id === 'chainmail_helmet' ||
    id === 'iron_helmet' ||
    id === 'turtle_helmet' ||
    id === 'turtle_shell'
  ) {
    return 2;
  }
  if (id === 'diamond_helmet' || id === 'netherite_helmet') return 3;
  return 0;
}

// Wiki (minecraft.wiki/w/Turtle_Shell): "Wearing it grants the
// Water Breathing effect for 10 seconds when out of water." Misnamed
// `conduitWaterBreathing` originally — turtle shell is the source,
// not a conduit. Function preserved for back-compat.
export function conduitWaterBreathing(id: string): boolean {
  return id === 'turtle_helmet' || id === 'turtle_shell';
}
