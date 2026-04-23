export interface Gate {
  facing: 'n' | 's' | 'e' | 'w';
  open: boolean;
  powered: boolean;
  inWall: boolean;
}

export function verticalOffset(g: Gate): number {
  return g.inWall ? 0.0625 : 0;
}

export function opensFromRedstone(g: Gate): boolean {
  return g.powered;
}

export function allowsEntities(g: Gate): boolean {
  return g.open;
}
