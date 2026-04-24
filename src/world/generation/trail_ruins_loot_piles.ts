export interface SuspiciousSurface {
  hasSherd: boolean;
  hasItem: boolean;
  item?: string;
  sherd?: string;
}

export function brush(
  s: SuspiciousSurface,
  rng: () => number,
): {
  result: SuspiciousSurface;
  dropped?: string;
} {
  if (s.hasItem && s.item !== undefined) {
    return { result: { ...s, hasItem: false }, dropped: s.item };
  }
  if (s.hasSherd && s.sherd !== undefined) {
    return { result: { ...s, hasSherd: false }, dropped: s.sherd };
  }
  if (rng() < 0.02) {
    return { result: s, dropped: 'emerald' };
  }
  return { result: s };
}

export function trailRuinsLootItems(): readonly string[] {
  return [
    'wheat',
    'coal',
    'emerald',
    'resin_clump',
    'brush',
    'shelter_pottery_sherd',
    'heart_pottery_sherd',
    'sheaf_pottery_sherd',
  ];
}
