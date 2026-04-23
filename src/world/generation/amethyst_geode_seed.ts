export interface GeodeParams {
  innerBlock: string;
  outerBlock: string;
  outermostShell: string;
  minY: number;
  maxY: number;
}

export const DEFAULT_PARAMS: GeodeParams = {
  innerBlock: 'amethyst_block',
  outerBlock: 'calcite',
  outermostShell: 'smooth_basalt',
  minY: -58,
  maxY: 30,
};

export function yInRange(y: number, p: GeodeParams = DEFAULT_PARAMS): boolean {
  return y >= p.minY && y <= p.maxY;
}

export function spawnRatioPerChunk(): number {
  return 1 / 53;
}

export function containsBuddingAmethyst(): boolean {
  return true;
}
