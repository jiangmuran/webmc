// Mining-speed table. Returns the time in seconds to break a block given
// the player's held tool and whether they're on-ground / in-water. Matches
// MC's formula: baseTime = hardness * penalty; penalty = 1.5 if the correct
// tool is used, 5 otherwise; tool_tier multiplier scales the result down.
//
// Correct tool: pickaxe → stone family; axe → wood family; shovel → dirt
// family; sword → leaves + web; hand → anything (slow).

export type ToolKind = 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'hand';
export type ToolTier = 0 | 1 | 2 | 3 | 4; // wood, stone, iron, diamond, netherite

export type BlockMaterial =
  | 'stone'
  | 'wood'
  | 'dirt'
  | 'sand'
  | 'leaves'
  | 'wool'
  | 'glass'
  | 'web'
  | 'obsidian'
  | 'unbreakable'
  | 'other';

// tool tier → speed multiplier (MC: wood=2, stone=4, iron=6, diamond=8,
// netherite=9, hand=1).
const TIER_SPEED: readonly number[] = [2, 4, 6, 8, 9];
const HAND_SPEED = 1;

// Which material the tool can EFFECTIVELY break.
const TOOL_MATERIAL: Record<ToolKind, readonly BlockMaterial[]> = {
  pickaxe: ['stone', 'obsidian'],
  axe: ['wood'],
  shovel: ['dirt', 'sand'],
  hoe: ['leaves'],
  sword: ['web', 'wool'],
  hand: [],
};

// Minimum tier required to *drop* the block (not just break it faster).
// Obsidian requires diamond (3), iron ore requires stone (1), etc.
const MIN_DROP_TIER: Record<BlockMaterial, ToolTier> = {
  stone: 0,
  wood: 0,
  dirt: 0,
  sand: 0,
  leaves: 0,
  wool: 0,
  glass: 0,
  web: 0,
  obsidian: 3,
  unbreakable: 4, // can't actually be broken but placate the type
  other: 0,
};

export interface BreakQuery {
  hardness: number; // block hardness (from BlockDef.hardness)
  material: BlockMaterial;
  toolKind: ToolKind;
  toolTier: ToolTier;
  onGround?: boolean; // false = +5x penalty
  inWater?: boolean; // true = +5x penalty unless aqua affinity
  aquaAffinity?: boolean; // cancels water penalty
  efficiency?: number; // enchantment level
  hasteLevel?: number; // status effect
  fatigueLevel?: number; // mining fatigue status effect
}

export function breakTime(q: BreakQuery): number {
  if (q.material === 'unbreakable' || q.hardness < 0) return Infinity;
  const canDrop = q.toolTier >= MIN_DROP_TIER[q.material];
  const correctTool = TOOL_MATERIAL[q.toolKind].includes(q.material);
  // Speed base.
  let speed = q.toolKind === 'hand' ? HAND_SPEED : (TIER_SPEED[q.toolTier] ?? HAND_SPEED);
  if (!correctTool) speed = HAND_SPEED; // wrong tool = hand speed
  // Efficiency enchant: level² + 1 added to speed.
  if (q.efficiency && q.efficiency > 0 && correctTool) {
    speed += q.efficiency * q.efficiency + 1;
  }
  // Haste: 20% per level; mining fatigue: 30%⁻level multiplier.
  if (q.hasteLevel && q.hasteLevel > 0) speed *= 1 + 0.2 * q.hasteLevel;
  if (q.fatigueLevel && q.fatigueLevel > 0) speed *= 0.3 ** q.fatigueLevel;
  // Penalties.
  const inWaterPenalty = q.inWater && !q.aquaAffinity ? 5 : 1;
  const airPenalty = q.onGround === false ? 5 : 1;
  const penalty = inWaterPenalty * airPenalty;
  // MC time = hardness * (canHarvest ? 1.5 : 5) / speed.
  const materialPenalty = canDrop && correctTool ? 1.5 : 5;
  return (q.hardness * materialPenalty * penalty) / speed;
}

export function canHarvest(q: Pick<BreakQuery, 'material' | 'toolTier'>): boolean {
  return q.toolTier >= MIN_DROP_TIER[q.material];
}
