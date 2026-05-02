// Coral drying. Live coral block out of water for 1 random tick dies
// to dead coral. Coral fan + wall coral same rule.

export const CORAL_COLORS = ['tube', 'brain', 'bubble', 'fire', 'horn'] as const;
export type CoralColor = (typeof CORAL_COLORS)[number];

export type CoralShape = 'block' | 'fan' | 'wall_fan';

export interface Coral {
  color: CoralColor;
  shape: CoralShape;
  dead: boolean;
  waterlogged: boolean;
}

export interface DryQuery {
  adjacentWater: boolean;
}

export function shouldDie(c: Coral, q: DryQuery): boolean {
  if (c.dead) return false;
  if (c.waterlogged) return false;
  if (q.adjacentWater) return false;
  return true;
}

export function deadName(c: Coral): string {
  const prefix =
    c.shape === 'block'
      ? `dead_${c.color}_coral_block`
      : c.shape === 'fan'
        ? `dead_${c.color}_coral_fan`
        : `dead_${c.color}_coral_wall_fan`;
  return `webmc:${prefix}`;
}

// Coral breaking. Wiki has DIFFERENT rules for blocks vs fans:
//
// Coral blocks (minecraft.wiki/w/Coral_Block): "if mined with a
// pickaxe not enchanted with Silk Touch, they drop the respective
// dead coral block." → no-silk yields the dead variant.
//
// Coral fans / wall fans (minecraft.wiki/w/Coral_Fan): "Breaking
// coral fans without Silk Touch destroys the coral fan." → no-silk
// yields NOTHING. Old code returned a dead-fan ID for fans too,
// which would have made coral-fan farms self-renewing without silk
// touch — exactly the case wiki carves out.
export function breakDrops(c: Coral, silkTouch: boolean): string | null {
  const prefix = c.shape === 'block' ? 'coral_block' : 'coral_fan';
  if (silkTouch) {
    return c.dead ? `webmc:dead_${c.color}_${prefix}` : `webmc:${c.color}_${prefix}`;
  }
  // No silk touch: blocks drop dead variant, fans drop nothing.
  if (c.shape === 'block') return `webmc:dead_${c.color}_${prefix}`;
  return null;
}
