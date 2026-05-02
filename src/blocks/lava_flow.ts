// Lava flow. Slower than water (1-2 blocks/tick vs 5). Nether lava
// flows further (7 instead of 3). Lava + water = obsidian; flowing
// lava on soul soil = basalt generator.

export type Dim = 'overworld' | 'nether' | 'end';

export const WATER_SPREAD = 7;
export const LAVA_SPREAD_OVERWORLD = 3;
export const LAVA_SPREAD_NETHER = 7;

export function lavaSpread(d: Dim): number {
  return d === 'nether' ? LAVA_SPREAD_NETHER : LAVA_SPREAD_OVERWORLD;
}

export type FlowReaction =
  | { kind: 'none' }
  | { kind: 'obsidian' }
  | { kind: 'cobblestone' }
  | { kind: 'stone' }
  | { kind: 'basalt' };

export interface ContactQuery {
  source: 'lava' | 'water';
  sourceIsStill: boolean;
  other: 'lava' | 'water' | 'soul_soil' | 'blue_ice' | null;
  otherIsStill: boolean;
  /**
   * Per wiki, stone forms ONLY when flowing lava drops onto water from
   * above (the directional case). Default false produces the canonical
   * horizontal cobblestone-generator behavior.
   */
  lavaFlowFromAbove?: boolean;
}

// Wiki (minecraft.wiki/w/Cobblestone#Post-generation): "When water
// and flowing lava come into contact, the flowing lava is replaced
// by cobblestone. However, if the lava flows on top of the water
// from above, stone is created instead. Non-flowing lava (a lava
// source block) turns into obsidian upon contact with water."
//
// So:
//   lava SOURCE + any water           → obsidian
//   flowing lava FROM ABOVE + water   → stone (vertical-flow case)
//   flowing lava ANY OTHER direction  → cobblestone
//
// Old code used `otherIsStill` (water-source flag) as the stone
// trigger — but per wiki the stone case is the directional
// "lava-from-above-onto-water" rule, NOT "water happens to be a
// source." Horizontal flowing lava meeting a water source (the
// classic cobblestone generator) was incorrectly producing stone.
// Sibling lava_encounter_water.ts has the same fix; this aligns the
// second copy.
export function interact(q: ContactQuery): FlowReaction {
  if (q.source === 'lava') {
    if (q.other === 'water') {
      if (q.sourceIsStill) return { kind: 'obsidian' };
      return q.lavaFlowFromAbove === true ? { kind: 'stone' } : { kind: 'cobblestone' };
    }
    if (q.other === 'soul_soil' && q.otherIsStill) return { kind: 'basalt' };
    if (q.other === 'blue_ice') return { kind: 'basalt' };
  }
  if (q.source === 'water' && q.other === 'lava') {
    if (q.otherIsStill) return { kind: 'obsidian' };
    return q.lavaFlowFromAbove === true ? { kind: 'stone' } : { kind: 'cobblestone' };
  }
  return { kind: 'none' };
}

// Fire ignition range from lava: flammable blocks within 1..2 blocks
// around lava may ignite.
export const LAVA_FIRE_RADIUS = 2;
