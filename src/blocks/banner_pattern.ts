export interface Layer {
  pattern: string;
  color: string;
}

// Wiki (minecraft.wiki/w/Banner): "A banner can have up to 6 patterns
// applied to it." Old 16 was 2.6× the wiki cap; siblings banner.ts and
// banner_pattern_layering.ts already use 6 — this third copy was the
// outlier. Anvil/loom UI gates on this constant, so the wrong value
// silently let players stack double-digit layers.
export const MAX_LAYERS = 6;

export function addLayer(layers: Layer[], l: Layer): Layer[] | undefined {
  if (layers.length >= MAX_LAYERS) return undefined;
  return [...layers, l];
}

export function clearCauldronDye(layers: Layer[]): Layer[] {
  return layers.slice(0, -1);
}

export function identifierFor(layers: Layer[]): string {
  return layers.map((l) => `${l.color}.${l.pattern}`).join('|');
}
