// HUD layout scale. Computes hotbar, hearts, hunger positions from
// viewport + hudScale setting.

export interface Viewport {
  w: number;
  h: number;
  hudScale: number;
}

export interface HudLayout {
  hotbarX: number;
  hotbarY: number;
  hotbarW: number;
  hotbarH: number;
  heartsX: number;
  heartsY: number;
  hungerX: number;
  hungerY: number;
}

const HOTBAR_UNITS = 182;
const BAR_UNITS = 81;

export function computeLayout(v: Viewport): HudLayout {
  const s = v.hudScale;
  const hotbarW = HOTBAR_UNITS * s;
  const hotbarH = 22 * s;
  const hotbarX = Math.round((v.w - hotbarW) / 2);
  const hotbarY = Math.round(v.h - hotbarH - 4 * s);
  const heartsX = hotbarX;
  const heartsY = hotbarY - 12 * s;
  const hungerX = hotbarX + hotbarW - BAR_UNITS * s;
  const hungerY = heartsY;
  return { hotbarX, hotbarY, hotbarW, hotbarH, heartsX, heartsY, hungerX, hungerY };
}

export function hotbarSlotCenter(
  l: HudLayout,
  slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
): {
  x: number;
  y: number;
} {
  const slotW = l.hotbarW / 9;
  return { x: l.hotbarX + slotW * slot + slotW / 2, y: l.hotbarY + l.hotbarH / 2 };
}
