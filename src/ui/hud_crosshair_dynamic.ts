export type CrosshairStyle = 'cross' | 'dot' | 'cross_thin';

export interface HudCtx {
  weaponCharge: number;
  looksAtEntity: boolean;
  looksAtBlockOutline: boolean;
}

export function crosshairOpacity(c: HudCtx): number {
  if (!c.looksAtEntity && !c.looksAtBlockOutline) return 0.5;
  return 1;
}

export function charged(c: HudCtx): boolean {
  return c.weaponCharge >= 1;
}
