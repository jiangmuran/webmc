export interface Layer {
  pattern: string;
  color: string;
}

export const MAX_LAYERS = 16;

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
