// Screen DPI-aware render scale. Reduces framebuffer dim on high-DPI
// mobile devices to maintain frame budget.

export interface DeviceProfile {
  dpr: number;
  gpuTier: 'low' | 'mid' | 'high';
}

export function renderScaleFor(p: DeviceProfile): number {
  if (p.gpuTier === 'high') return Math.min(p.dpr, 2);
  if (p.gpuTier === 'mid') return Math.min(p.dpr, 1.5);
  return Math.min(p.dpr, 1);
}

export function framebufferSize(
  cssW: number,
  cssH: number,
  scale: number,
): { w: number; h: number } {
  return { w: Math.round(cssW * scale), h: Math.round(cssH * scale) };
}

// Auto-adjust when sustained frame time exceeds budget.
export function adjustForFrameTime(current: number, avgFrameMs: number, budgetMs: number): number {
  if (avgFrameMs > budgetMs * 1.2) return Math.max(0.5, current - 0.1);
  if (avgFrameMs < budgetMs * 0.7) return Math.min(2, current + 0.1);
  return current;
}
