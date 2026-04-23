export interface Layer {
  pattern: string;
  color: string;
}

export interface Combine {
  shieldLayers: Layer[];
  bannerLayers: Layer[];
}

export function combinedShield(c: Combine): Layer[] | undefined {
  if (c.shieldLayers.length > 0) return undefined;
  return [...c.bannerLayers];
}

export function consumesBanner(): boolean {
  return true;
}
