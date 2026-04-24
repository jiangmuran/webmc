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

export function dolphinsGraceProvided(activated: boolean, frameBlocks: number): boolean {
  return activated && frameBlocks >= 16;
}
