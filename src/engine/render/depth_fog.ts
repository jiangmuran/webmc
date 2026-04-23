export interface FogParams {
  start: number;
  end: number;
  color: [number, number, number];
}

export function fogFactor(distance: number, p: FogParams): number {
  if (distance <= p.start) return 0;
  if (distance >= p.end) return 1;
  return (distance - p.start) / (p.end - p.start);
}

export function mixColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function fogParamsForDim(dim: 'overworld' | 'nether' | 'end'): FogParams {
  if (dim === 'nether') return { start: 0, end: 80, color: [0.45, 0.18, 0.15] };
  if (dim === 'end') return { start: 20, end: 120, color: [0.05, 0.02, 0.07] };
  return { start: 80, end: 192, color: [0.7, 0.8, 1] };
}
