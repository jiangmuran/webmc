// Backpressure gate. When DataChannel.bufferedAmount is high, stop
// sending non-critical messages.

export interface BackpressureCtx {
  bufferedAmount: number;
  highWatermark: number;
  lowWatermark: number;
}

export function shouldPauseNonCritical(c: BackpressureCtx): boolean {
  return c.bufferedAmount >= c.highWatermark;
}

export function canResume(c: BackpressureCtx): boolean {
  return c.bufferedAmount <= c.lowWatermark;
}

export function queueDepthHealth(c: BackpressureCtx): 'healthy' | 'warning' | 'critical' {
  if (c.bufferedAmount >= c.highWatermark) return 'critical';
  if (c.bufferedAmount >= c.highWatermark * 0.5) return 'warning';
  return 'healthy';
}

export const DEFAULT_HIGH_WATERMARK = 1 << 20; // 1 MB
export const DEFAULT_LOW_WATERMARK = 1 << 18; // 256 KB
