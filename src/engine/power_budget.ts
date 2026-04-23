// Mobile thermal / battery-aware power budget. Target frame ms adjusts
// based on battery level + charging + thermal state.

export interface PowerCtx {
  batteryLevel: number; // 0..1
  charging: boolean;
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
}

export const BASE_FRAME_MS = 33.3; // 30 FPS mobile target
export const DESKTOP_FRAME_MS = 16.6;

export function targetFrameMs(c: PowerCtx, desktop: boolean): number {
  if (desktop) return DESKTOP_FRAME_MS;
  if (c.thermalState === 'critical') return 50;
  if (c.thermalState === 'serious') return 40;
  if (!c.charging && c.batteryLevel < 0.2) return 40;
  return BASE_FRAME_MS;
}

export function shouldPauseRender(c: PowerCtx): boolean {
  return !c.charging && c.batteryLevel < 0.05;
}

export function maxRenderDistanceChunks(c: PowerCtx, desktop: boolean): number {
  if (desktop) return 12;
  if (c.thermalState === 'critical') return 2;
  if (c.thermalState === 'serious') return 3;
  return 4;
}
