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

// Coral breaking. Wiki (minecraft.wiki/w/Coral_Block): "Coral blocks
// can be obtained only with a pickaxe enchanted with Silk Touch; if
// mined with a pickaxe not enchanted with Silk Touch, they drop the
// respective dead coral block." Old code returned null for the
// no-silk-touch case, which dropped *nothing* — players mining a
// live coral pillar lost it entirely instead of getting the dead
// variant they could replant elsewhere.
export function breakDrops(c: Coral, silkTouch: boolean): string {
  const prefix = c.shape === 'block' ? 'coral_block' : 'coral_fan';
  if (silkTouch) {
    return c.dead ? `webmc:dead_${c.color}_${prefix}` : `webmc:${c.color}_${prefix}`;
  }
  // Without silk touch: live coral converts to dead, dead drops itself.
  return `webmc:dead_${c.color}_${prefix}`;
}
