export function hashStringToSeed(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h | 0;
}

export function deriveSubSeed(worldSeed: number, purpose: string): number {
  return (hashStringToSeed(purpose) ^ worldSeed) | 0;
}

export function rngFromSeed(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 1000000) / 1000000;
  };
}
