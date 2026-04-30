export interface Layer {
  pattern: string;
  color: string;
}

// Wiki (minecraft.wiki/w/Banner): "A banner can have up to 6 patterns
// applied to it." Same 16→6 bug previously fixed in three sibling
// modules; this fourth copy was the outlier.
export const MAX_LAYERS = 6;

export function addLayerOrFail(layers: Layer[], l: Layer): Layer[] | undefined {
  if (layers.length >= MAX_LAYERS) return undefined;
  return [...layers, l];
}

export function removeTopLayerViaCauldron(layers: Layer[]): Layer[] {
  if (layers.length === 0) return layers;
  return layers.slice(0, -1);
}

export function identifier(layers: Layer[]): string {
  return layers.map((l) => `${l.color}.${l.pattern}`).join('|');
}
