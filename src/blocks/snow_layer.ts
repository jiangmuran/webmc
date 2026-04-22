// Snow layer. Accumulates 1..8 layers during snowfall on top of solid
// blocks with light-2 or below. Melts in warm biomes or under torches.

export interface SnowLayerState {
  layers: number; // 1..8; layer 8 = full snow block
}

export function makeSnowLayer(layers = 1): SnowLayerState {
  return { layers: Math.max(1, Math.min(8, layers)) };
}

export interface SnowAccumulationCtx {
  isSnowing: boolean;
  lightLevel: number;
  surfaceTemperature: number; // snow biome temp ≤ 0.15
  dtSec: number;
}

export interface SnowTickResult {
  changed: boolean;
  melted: boolean;
  converted: boolean; // to full snow_block
}

const ACCUMULATE_CHANCE_PER_TICK = 0.01;
const MELT_CHANCE_PER_TICK = 0.02;

export function tickSnowLayer(
  state: SnowLayerState,
  ctx: SnowAccumulationCtx,
  rng: () => number = Math.random,
): SnowTickResult {
  const freezing = ctx.surfaceTemperature <= 0.15;
  if (ctx.isSnowing && freezing && state.layers < 8) {
    if (rng() < ACCUMULATE_CHANCE_PER_TICK * ctx.dtSec) {
      state.layers++;
      if (state.layers === 8) return { changed: true, melted: false, converted: true };
      return { changed: true, melted: false, converted: false };
    }
  }
  if (!freezing || ctx.lightLevel > 11) {
    if (rng() < MELT_CHANCE_PER_TICK * ctx.dtSec) {
      state.layers--;
      if (state.layers <= 0) return { changed: true, melted: true, converted: false };
      return { changed: true, melted: false, converted: false };
    }
  }
  return { changed: false, melted: false, converted: false };
}
