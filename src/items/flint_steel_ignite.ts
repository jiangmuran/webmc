export interface Target {
  block: string;
  adjacentToFlammable: boolean;
}

export function ignitesBlock(t: Target): string | undefined {
  if (t.block === 'tnt') return 'tnt_primed';
  if (t.block === 'campfire') return 'lit_campfire';
  if (t.block === 'obsidian_frame') return 'nether_portal';
  if (t.block === 'netherrack' || t.adjacentToFlammable) return 'fire';
  return undefined;
}

export function durabilityCost(): number {
  return 1;
}
