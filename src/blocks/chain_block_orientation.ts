export type Axis = 'x' | 'y' | 'z';

export interface ChainCtx {
  clickedFace: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
  waterlogged: boolean;
}

export function axisFromClick(c: ChainCtx): Axis {
  switch (c.clickedFace) {
    case 'up':
    case 'down':
      return 'y';
    case 'north':
    case 'south':
      return 'z';
    case 'east':
    case 'west':
      return 'x';
  }
}

export function isWaterlogged(c: ChainCtx): boolean {
  return c.waterlogged;
}
