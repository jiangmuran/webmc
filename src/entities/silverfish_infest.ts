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

export function cascadeRadius(): number {
  return 2;
}
