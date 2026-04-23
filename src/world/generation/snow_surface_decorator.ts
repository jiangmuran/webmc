export interface SurfaceCtx {
  biomeTemp: number;
  y: number;
  topBlock: string;
  aboveAir: boolean;
}

export function placesTopSnow(c: SurfaceCtx): boolean {
  if (!c.aboveAir) return false;
  if (c.biomeTemp >= 0.15) return false;
  return c.topBlock === 'grass_block' || c.topBlock === 'dirt' || c.topBlock === 'stone';
}

export function iceOnLakeSurface(c: SurfaceCtx): boolean {
  return c.topBlock === 'water' && c.biomeTemp < 0.15;
}
