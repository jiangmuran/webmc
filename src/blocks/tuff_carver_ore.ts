export interface TuffCtx {
  block: string;
  oreWithin: string[];
}

export function replacesStone(block: string): boolean {
  return block === 'stone' || block === 'deepslate';
}

export function oreVariantName(baseOre: string): string {
  return `tuff_${baseOre}_ore`;
}

export function oresEmbeddable(c: TuffCtx): string[] {
  return c.oreWithin.filter((o) => o === 'copper' || o === 'iron');
}
