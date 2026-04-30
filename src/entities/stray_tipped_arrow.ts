// Stray: snowy-biome skeleton variant. Shoots tipped arrows applying
// Slowness. Drops arrow of slowness on death.

export const STRAY_SLOWNESS_DURATION_TICKS = 600;
export const STRAY_SLOWNESS_AMPLIFIER = 0;

export interface StrayShot {
  arrowType: 'tipped_slowness';
  slownessDurationTicks: number;
  amplifier: number;
}

export function nextShot(): StrayShot {
  return {
    arrowType: 'tipped_slowness',
    slownessDurationTicks: STRAY_SLOWNESS_DURATION_TICKS,
    amplifier: STRAY_SLOWNESS_AMPLIFIER,
  };
}

export function dropsOnDeath(rand: () => number): string[] {
  const drops: string[] = ['bone'];
  if (rand() < 0.5) drops.push('arrow_slowness');
  return drops;
}

// Wiki (minecraft.wiki/w/Stray): "A stray may spawn directly under
// the sky in snowy plains or ice spikes, replacing 80% of skeletons."
// Bedrock additionally allows frozen rivers, frozen oceans, deep
// frozen oceans, legacy frozen oceans, snowy slopes, jagged peaks,
// and frozen peaks; webmc targets Java per AGENT_CHARTER, so only
// snowy_plains and ice_spikes apply.
//
// Old check `biome.includes('snowy')` matched 'snowy_plains' but
// missed 'ice_spikes' entirely, and included Bedrock-only biomes
// (frozen_ocean, frozen_river) that don't spawn strays in Java.
const JE_STRAY_SPAWN_BIOMES = new Set<string>(['snowy_plains', 'ice_spikes']);

export function onlySpawnsInSnowyBiomes(biome: string): boolean {
  return JE_STRAY_SPAWN_BIOMES.has(biome);
}
