// Lava/water interactions form cobblestone, stone, or obsidian.
// Lava source + adjacent water source → obsidian. Flowing water over
// flowing lava → cobblestone. Flowing lava over water → stone.

export interface FluidCtx {
  hereIsLavaSource: boolean;
  hereIsLavaFlow: boolean;
  hereIsWaterFlow: boolean;
  hereIsWaterSource: boolean;
  neighborWaterFlow: boolean;
  neighborLavaSource: boolean;
  neighborWaterSource: boolean;
}

export type FormResult = 'obsidian' | 'stone' | 'cobblestone' | 'none';

export function form(c: FluidCtx): FormResult {
  if (c.hereIsLavaSource && c.neighborWaterFlow) return 'obsidian';
  if (c.hereIsLavaSource && c.neighborWaterSource) return 'obsidian';
  if (c.hereIsWaterFlow && c.hereIsLavaFlow) return 'cobblestone';
  if (c.hereIsLavaFlow && c.hereIsWaterFlow) return 'cobblestone';
  if (c.hereIsLavaFlow && c.neighborWaterFlow) return 'stone';
  return 'none';
}

export function sizzleSound(r: FormResult): boolean {
  return r !== 'none';
}
