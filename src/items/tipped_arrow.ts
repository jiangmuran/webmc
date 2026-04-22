// Tipped arrows — made by crafting arrows around a lingering potion. On
// hit, apply the potion's effect to the target at 1/8 of the potion's
// duration.

import type { PotionEffect } from './potion';
import { POTIONS } from './potion';

export interface TippedArrowState {
  effect: PotionEffect;
  potionKey: string; // original potion for display
}

export function makeTippedArrow(potionKey: string): TippedArrowState | null {
  const def = POTIONS[potionKey];
  if (!def) return null;
  const eff = def.effects[0];
  if (!eff) return null;
  return {
    potionKey,
    effect: {
      id: eff.id,
      amplifier: eff.amplifier,
      durationSec: eff.durationSec / 8,
    },
  };
}

export interface TargetReceiver {
  applyEffect(id: string, amplifier: number, durationSec: number): void;
}

export function applyTippedArrowEffect(arrow: TippedArrowState, target: TargetReceiver): void {
  target.applyEffect(arrow.effect.id, arrow.effect.amplifier, arrow.effect.durationSec);
}
