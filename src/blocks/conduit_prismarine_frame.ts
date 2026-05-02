export function blocksNeededForFullFrame(): number {
  return 42;
}

export function validFrameBlock(id: string): boolean {
  return (
    id === 'prismarine' ||
    id === 'prismarine_bricks' ||
    id === 'dark_prismarine' ||
    id === 'sea_lantern'
  );
}

export function activationRadius(frameBlocks: number): number {
  if (frameBlocks < 16) return 0;
  return Math.min(96, 16 * Math.floor(frameBlocks / 7));
}

// Wiki (minecraft.wiki/w/Conduit): "When activated, conduits give
// the 'Conduit Power' effect to all players in contact with rain or
// water." Conduit does NOT grant Dolphin's Grace — that effect comes
// from swimming near a live dolphin entity, a wholly separate
// mechanic. The old `dolphinsGraceProvided` name was a misnomer that
// would have misled callers wiring up effect flags.
export function conduitPowerProvided(activated: boolean, frameBlocks: number): boolean {
  return activated && frameBlocks >= 16;
}
