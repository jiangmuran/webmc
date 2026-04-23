export type Mode = 'compare' | 'subtract';

export interface Input {
  mode: Mode;
  rear: number;
  leftSide: number;
  rightSide: number;
}

export function output(i: Input): number {
  const side = Math.max(i.leftSide, i.rightSide);
  if (i.mode === 'subtract') return Math.max(0, i.rear - side);
  return side > i.rear ? 0 : i.rear;
}

export function togglesMode(current: Mode): Mode {
  return current === 'compare' ? 'subtract' : 'compare';
}
