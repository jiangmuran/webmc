// Breaking a minecart returns its item (empty cart or with contents).
// Minecart with chest drops both cart + inventory.

export type MinecartKind =
  | 'minecart'
  | 'chest_minecart'
  | 'furnace_minecart'
  | 'hopper_minecart'
  | 'tnt_minecart'
  | 'command_block_minecart'
  | 'spawner_minecart';

export function itemId(kind: MinecartKind): string {
  return kind;
}

export function dropsContentsOnBreak(kind: MinecartKind): boolean {
  return kind === 'chest_minecart' || kind === 'hopper_minecart';
}

export function explodesOnBreak(kind: MinecartKind, poweredByRail: boolean): boolean {
  return kind === 'tnt_minecart' && poweredByRail;
}

export function creativeOnlyKind(kind: MinecartKind): boolean {
  return kind === 'command_block_minecart' || kind === 'spawner_minecart';
}
