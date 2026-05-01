// Silverfish: hide in infested stone/deepslate/etc. Break the block
// to release the mob. Nearby infested blocks cascade when attacked.

export type InfestedKind =
  | 'infested_stone'
  | 'infested_cobblestone'
  | 'infested_stone_bricks'
  | 'infested_mossy_stone_bricks'
  | 'infested_cracked_stone_bricks'
  | 'infested_chiseled_stone_bricks'
  | 'infested_deepslate';

export function blockFor(kind: InfestedKind): string {
  return kind.replace(/^infested_/, '');
}

export interface BreakEvent {
  kind: InfestedKind;
  hitByPlayer: boolean;
  silkTouch: boolean;
}

export type BreakOutcome = { kind: 'released_mob' } | { kind: 'dropped_block'; id: string };

export function onBreak(e: BreakEvent): BreakOutcome {
  if (e.silkTouch) return { kind: 'dropped_block', id: e.kind };
  if (e.hitByPlayer) return { kind: 'released_mob' };
  return { kind: 'released_mob' };
}

// Wiki (minecraft.wiki/w/Silverfish): "they cause other silverfish
// within a 21×11×21 area to break out of their infested blocks."
// 21 along XZ = ±10, 11 along Y = ±5. Old `2` here was unrelated to
// the wiki number (off by 5× horizontal, 2.5× vertical) — sibling
// silverfish_summon.ts uses 10/5, which is correct.
export const CASCADE_RADIUS_XZ = 10;
export const CASCADE_RADIUS_Y = 5;

export function cascadeRadius(): number {
  return CASCADE_RADIUS_XZ;
}
