// Coral bleaching. Live coral (tube=blue, brain=pink, bubble=purple,
// fire=red, horn=yellow) placed outside water for >= 1 random tick
// dies and turns into its "dead" variant. Dead coral doesn't revive.
// Wiki: minecraft.wiki/w/Coral.

export type CoralColor = 'tube' | 'brain' | 'bubble' | 'fire' | 'horn';
export type CoralVariant = 'block' | 'fan' | 'plant';

export interface CoralState {
  color: CoralColor;
  variant: CoralVariant;
  dead: boolean;
  dryTicks: number;
}

const DRY_TICKS_TO_DEATH = 1;

export function makeCoral(color: CoralColor, variant: CoralVariant = 'block'): CoralState {
  return { color, variant, dead: false, dryTicks: 0 };
}

export interface CoralLookup {
  hasWaterAdjacent: boolean;
}

export function tickCoral(state: CoralState, ctx: CoralLookup): void {
  if (state.dead) return;
  if (ctx.hasWaterAdjacent) {
    state.dryTicks = 0;
    return;
  }
  state.dryTicks++;
  if (state.dryTicks >= DRY_TICKS_TO_DEATH) {
    state.dead = true;
  }
}

export function deadBlockName(state: CoralState): string {
  return state.dead ? `webmc:dead_${state.color}_coral` : `webmc:${state.color}_coral`;
}
