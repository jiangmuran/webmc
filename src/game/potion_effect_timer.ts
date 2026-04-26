export interface PotionEffect {
  id: string;
  amplifier: number;
  durationTicks: number;
  ambient: boolean;
  showParticles: boolean;
}

export function tickEffect(e: PotionEffect): PotionEffect {
  return { ...e, durationTicks: Math.max(0, e.durationTicks - 1) };
}

export function expired(e: PotionEffect): boolean {
  return e.durationTicks <= 0;
}

export function merge(a: PotionEffect, b: PotionEffect): PotionEffect {
  if (b.amplifier > a.amplifier) return b;
  if (b.amplifier === a.amplifier && b.durationTicks > a.durationTicks) return b;
  return a;
}

// Module-scope Set lookup. Was a fresh 19-element array literal +
// O(N) .includes() scan per call — even with low call frequency
// (ActiveEffectsHud render gated by sig-cache), the per-call array
// alloc is pure waste.
const BENEFICIAL_EFFECTS: ReadonlySet<string> = new Set([
  'regeneration',
  'speed',
  'strength',
  'jump_boost',
  'resistance',
  'fire_resistance',
  'water_breathing',
  'invisibility',
  'night_vision',
  'health_boost',
  'absorption',
  'saturation',
  'glowing',
  'luck',
  'slow_falling',
  'conduit_power',
  'dolphins_grace',
  'hero_of_the_village',
  'instant_health',
]);

export function isBeneficial(id: string): boolean {
  return BENEFICIAL_EFFECTS.has(id);
}
