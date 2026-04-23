export interface Layer {
  pattern: string;
  color: string;
}

export const MAX_LAYERS = 16;

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
