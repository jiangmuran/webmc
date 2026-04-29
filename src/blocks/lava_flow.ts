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
}

// Wiki (minecraft.wiki/w/Stone#Generation): lava source + water (any)
// → obsidian. Flowing lava + water source → STONE. Flowing lava +
// flowing water → cobblestone. Old code returned cobblestone for any
// flowing-lava case and missed the stone-formation rule entirely
// (the 'stone' kind was defined but never produced).
export function interact(q: ContactQuery): FlowReaction {
  if (q.source === 'lava') {
    if (q.other === 'water') {
      if (q.sourceIsStill) return { kind: 'obsidian' };
      return q.otherIsStill ? { kind: 'stone' } : { kind: 'cobblestone' };
    }
    if (q.other === 'soul_soil' && q.otherIsStill) return { kind: 'basalt' };
    if (q.other === 'blue_ice') return { kind: 'basalt' };
  }
  if (q.source === 'water' && q.other === 'lava') {
    if (q.otherIsStill) return { kind: 'obsidian' };
    return q.sourceIsStill ? { kind: 'stone' } : { kind: 'cobblestone' };
  }
  return { kind: 'none' };
}

// Fire ignition range from lava: flammable blocks within 1..2 blocks
// around lava may ignite.
export const LAVA_FIRE_RADIUS = 2;
