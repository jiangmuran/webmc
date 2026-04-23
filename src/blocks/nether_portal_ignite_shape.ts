export type Axis = 'x' | 'z';

export interface PortalShape {
  axis: Axis;
  width: number;
  height: number;
}

export const MIN_WIDTH = 2;
export const MAX_WIDTH = 21;
export const MIN_HEIGHT = 3;
export const MAX_HEIGHT = 21;

export function isValidShape(s: PortalShape): boolean {
  return (
    s.width >= MIN_WIDTH && s.width <= MAX_WIDTH && s.height >= MIN_HEIGHT && s.height <= MAX_HEIGHT
  );
}

export function interiorBlocks(s: PortalShape): number {
  return s.width * s.height;
}

export function frameBlocksNeeded(s: PortalShape): number {
  return 2 * s.width + 2 * s.height + 4;
}
