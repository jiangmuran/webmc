// Axe attack damage + cooldown vs swords. Axes hit harder but swing
// slower. Critical axe hits against raised shields disable shields.
// Damage values (MC 1.20+):
//   wood axe:      base 7,  speed 0.8
//   stone axe:     base 9,  speed 0.8
//   iron axe:      base 9,  speed 0.9
//   diamond axe:   base 9,  speed 1.0
//   netherite axe: base 10, speed 1.0

export type ToolTier = 'wood' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite';

const AXE_DAMAGE: Record<ToolTier, number> = {
  wood: 7,
  stone: 9,
  iron: 9,
  gold: 7,
  diamond: 9,
  netherite: 10,
};

const AXE_SPEED: Record<ToolTier, number> = {
  wood: 0.8,
  stone: 0.8,
  iron: 0.9,
  gold: 1.0,
  diamond: 1.0,
  netherite: 1.0,
};

// Swords: faster, slightly lower damage.
const SWORD_DAMAGE: Record<ToolTier, number> = {
  wood: 4,
  stone: 5,
  iron: 6,
  gold: 4,
  diamond: 7,
  netherite: 8,
};

const SWORD_SPEED = 1.6;

export function axeDamage(tier: ToolTier): number {
  return AXE_DAMAGE[tier];
}

export function axeSpeed(tier: ToolTier): number {
  return AXE_SPEED[tier];
}

export function swordDamage(tier: ToolTier): number {
  return SWORD_DAMAGE[tier];
}

export function swordSpeed(): number {
  return SWORD_SPEED;
}

export interface AttackQuery {
  tool: 'axe' | 'sword' | 'fist';
  tier: ToolTier | null;
  chargedFraction: number; // 0..1, 1 = fully recovered
  critical: boolean;
}

export function attackDamage(q: AttackQuery): number {
  let base = 1;
  if (q.tool === 'axe' && q.tier) base = AXE_DAMAGE[q.tier];
  else if (q.tool === 'sword' && q.tier) base = SWORD_DAMAGE[q.tier];
  // Under-charged attacks scale down (MC: damage × (0.2 + 0.8 × charge²)).
  const chargeFactor = 0.2 + 0.8 * q.chargedFraction * q.chargedFraction;
  let dmg = base * chargeFactor;
  if (q.critical) dmg *= 1.5;
  return dmg;
}
