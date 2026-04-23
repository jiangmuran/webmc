export const TREASURE_ONLY = new Set([
  'mending',
  'soul_speed',
  'frost_walker',
  'swift_sneak',
  'wind_burst',
  'curse_of_vanishing',
  'curse_of_binding',
]);

export function isTreasureOnly(id: string): boolean {
  return TREASURE_ONLY.has(id);
}

export function canObtainFromEnchantingTable(id: string): boolean {
  return !isTreasureOnly(id);
}

export function sourceHintsFor(id: string): string[] {
  if (!isTreasureOnly(id)) return ['enchanting_table'];
  return ['librarian_trade', 'fishing', 'loot_chest'];
}
