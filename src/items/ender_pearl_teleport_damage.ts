// Ender pearl teleport damage. Player takes 5 damage per throw (halved
// with fall-resistance effects). No damage in creative.

export const TELEPORT_DAMAGE = 5;

export interface PearlCtx {
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  slowFalling: boolean;
  featherFallingLevel: number;
}

export function damageOnLand(c: PearlCtx): number {
  if (c.gamemode === 'creative' || c.gamemode === 'spectator') return 0;
  if (c.slowFalling) return 0;
  const reduction = Math.min(0.6, c.featherFallingLevel * 0.12);
  return TELEPORT_DAMAGE * (1 - reduction);
}

export function cooldownTicks(gamemode: string): number {
  return gamemode === 'creative' ? 0 : 20;
}

export function spawnsEndermiteChance(): number {
  return 0.05;
}
