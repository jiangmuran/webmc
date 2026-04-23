export type ErosionBucket = 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6';

export function bucketOf(n: number): ErosionBucket {
  if (n < -0.78) return 'E0';
  if (n < -0.375) return 'E1';
  if (n < -0.2225) return 'E2';
  if (n < 0.05) return 'E3';
  if (n < 0.45) return 'E4';
  if (n < 0.55) return 'E5';
  return 'E6';
}

export function surfaceSmoothness(b: ErosionBucket): number {
  const smoothness: Record<ErosionBucket, number> = {
    E0: 0.1,
    E1: 0.25,
    E2: 0.4,
    E3: 0.55,
    E4: 0.7,
    E5: 0.85,
    E6: 1,
  };
  return smoothness[b];
}
