// Worker pool sizing. min 2, max = hardwareConcurrency - 1, cap 4 on mobile.

export interface HostProfile {
  cores: number;
  isMobile: boolean;
}

export const MIN_WORKERS = 2;
export const MAX_MOBILE_WORKERS = 4;

export function workerCount(p: HostProfile): number {
  const leaveForMain = 1;
  const cap = p.isMobile ? MAX_MOBILE_WORKERS : Math.max(MIN_WORKERS, p.cores - leaveForMain);
  return Math.max(MIN_WORKERS, Math.min(cap, p.cores - leaveForMain));
}

export function canTransferBuffers(): boolean {
  return true;
}

export function prefersSharedArrayBuffer(): boolean {
  return false; // requires COOP/COEP; default off
}
