export interface DetectorRailInput {
  cartAbove: boolean;
  cartType: 'normal' | 'tnt' | 'chest' | 'hopper' | 'furnace' | 'command';
  cartHasItems?: boolean;
  cartFilledFraction?: number;
}

export function signalStrength(i: DetectorRailInput): number {
  if (!i.cartAbove) return 0;
  if ((i.cartType === 'chest' || i.cartType === 'hopper') && i.cartFilledFraction !== undefined) {
    return Math.min(15, Math.max(1, Math.floor(1 + i.cartFilledFraction * 14)));
  }
  return 15;
}

export function pulsesOnPass(hadCartLastTick: boolean, hasCartNow: boolean): boolean {
  return hasCartNow && !hadCartLastTick;
}
