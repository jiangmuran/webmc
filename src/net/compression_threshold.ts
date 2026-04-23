export const DEFAULT_THRESHOLD = 256;

export function shouldCompress(packetSize: number, threshold = DEFAULT_THRESHOLD): boolean {
  return packetSize >= threshold;
}

export function estimateSaving(original: number, compressed: number): number {
  return Math.max(0, original - compressed);
}

export function invalidThresholdDisables(threshold: number): boolean {
  return threshold <= 0;
}
