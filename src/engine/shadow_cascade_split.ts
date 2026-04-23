// Cascaded shadow map splits. Practical split scheme between uniform
// and logarithmic distribution based on a lambda parameter.

export function cascadeSplits(
  nearZ: number,
  farZ: number,
  cascadeCount: number,
  lambda = 0.5,
): number[] {
  const splits: number[] = [];
  for (let i = 1; i <= cascadeCount; i++) {
    const p = i / cascadeCount;
    const log = nearZ * Math.pow(farZ / nearZ, p);
    const uni = nearZ + (farZ - nearZ) * p;
    splits.push(lambda * log + (1 - lambda) * uni);
  }
  return splits;
}

export function splitForFragment(z: number, splits: number[]): number {
  for (let i = 0; i < splits.length; i++) {
    const s = splits[i];
    if (s !== undefined && z < s) return i;
  }
  return splits.length - 1;
}

export const DEFAULT_CASCADE_COUNT = 3;
