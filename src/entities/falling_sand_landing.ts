// Falling-block entity landing. Sand / gravel / concrete_powder /
// anvil fall. On landing: become a block if the target cell is
// replaceable; else drop as item. Anvils damage any entity they pass
// through and crack on landing.

export type BlockId = string;

export interface LandingQuery {
  blockId: BlockId;
  cellReplaceable: boolean;
  fallDistance: number;
}

export type LandingResult =
  | { kind: 'place'; blockId: BlockId }
  | { kind: 'drop_item'; blockId: BlockId };

export function landFalling(q: LandingQuery): LandingResult {
  if (q.cellReplaceable) return { kind: 'place', blockId: q.blockId };
  return { kind: 'drop_item', blockId: q.blockId };
}

// Anvil damage: 2 per block fallen past 1, capped at 40.
export const ANVIL_MAX_DAMAGE = 40;

export function anvilDamage(fallDistance: number): number {
  if (fallDistance <= 1) return 0;
  return Math.min(ANVIL_MAX_DAMAGE, Math.floor((fallDistance - 1) * 2));
}

// Anvil crack: 12% chance per landing.
export function anvilShouldCrack(rand: () => number): boolean {
  return rand() < 0.12;
}

// Crack degrades: anvil → chipped_anvil → damaged_anvil → destroyed.
const DEGRADE: Record<string, string | null> = {
  'webmc:anvil': 'webmc:chipped_anvil',
  'webmc:chipped_anvil': 'webmc:damaged_anvil',
  'webmc:damaged_anvil': null,
};

export function degradeAnvil(id: string): string | null {
  if (id in DEGRADE) return DEGRADE[id] ?? null;
  return id;
}
