// Entity tick priority buckets. Far entities tick less frequently to
// save CPU; near entities tick every frame.

export type TickBucket = 'near' | 'mid' | 'far' | 'frozen';

export const NEAR_MAX_BLOCKS = 32;
export const MID_MAX_BLOCKS = 64;
export const FAR_MAX_BLOCKS = 128;

export function bucketForDistance(d: number): TickBucket {
  if (d <= NEAR_MAX_BLOCKS) return 'near';
  if (d <= MID_MAX_BLOCKS) return 'mid';
  if (d <= FAR_MAX_BLOCKS) return 'far';
  return 'frozen';
}

export function tickInterval(b: TickBucket): number {
  if (b === 'near') return 1;
  if (b === 'mid') return 2;
  if (b === 'far') return 4;
  return 0; // frozen: do not tick
}

export function shouldTick(b: TickBucket, nowTick: number): boolean {
  const iv = tickInterval(b);
  if (iv === 0) return false;
  return nowTick % iv === 0;
}
