export interface UploadBudget {
  bytesUsedThisSecond: number;
  limitBytesPerSecond: number;
  windowStartMs: number;
}

export function canSend(b: UploadBudget, nowMs: number, size: number): boolean {
  if (nowMs - b.windowStartMs >= 1000) return size <= b.limitBytesPerSecond;
  return b.bytesUsedThisSecond + size <= b.limitBytesPerSecond;
}

export function afterSend(b: UploadBudget, nowMs: number, size: number): UploadBudget {
  if (nowMs - b.windowStartMs >= 1000) {
    return {
      bytesUsedThisSecond: size,
      limitBytesPerSecond: b.limitBytesPerSecond,
      windowStartMs: nowMs,
    };
  }
  return { ...b, bytesUsedThisSecond: b.bytesUsedThisSecond + size };
}
