// Structure void block. A special block used by the structure block
// system as a "keep existing world block" placeholder. When a structure
// is placed, a structure_void in the template skips the corresponding
// position (doesn't overwrite). Invisible in survival; only visible
// through an opaque-override admin tool.

export const STRUCTURE_VOID_ID = 'webmc:structure_void';

export interface PlaceContext {
  templateBlock: string;
  existingWorldBlock: string;
  integrity: number; // 0..1 — chance of placing this block
  rng: () => number;
}

export type PlaceDecision = { kind: 'keep'; block: string } | { kind: 'place'; block: string };

export function applyTemplateBlock(ctx: PlaceContext): PlaceDecision {
  if (ctx.templateBlock === STRUCTURE_VOID_ID) {
    return { kind: 'keep', block: ctx.existingWorldBlock };
  }
  if (ctx.integrity < 1 && ctx.rng() > ctx.integrity) {
    return { kind: 'keep', block: ctx.existingWorldBlock };
  }
  return { kind: 'place', block: ctx.templateBlock };
}

// Save mode: blocks matching the world at save time but recorded as
// structure_void for portability (lets a saved structure blend into
// arbitrary biomes).
export function inferSaveBlock(
  templateBlock: string,
  worldBlock: string,
  useVoid: boolean,
): string {
  if (!useVoid) return templateBlock;
  if (templateBlock === worldBlock) return STRUCTURE_VOID_ID;
  return templateBlock;
}

// Structure void is only visible in the structure block editor; for
// regular players, it's invisible and has no collision.
export function isVisibleToPlayer(
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator',
): boolean {
  return gamemode === 'creative' || gamemode === 'spectator';
}
