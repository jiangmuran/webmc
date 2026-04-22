// Mace item (1.21 Tricky Trials). Base damage 5; smash bonus scales with
// fall distance since leaving ground; heavy-core ingredient + breeze rod
// crafting. Unique enchants: density, breach, wind burst, smite.

export interface MaceAttackQuery {
  fallDistance: number; // blocks fallen since last ground contact
  critical: boolean; // true if player was falling and in attack window
  densityLevel: number; // 0..5
}

const BASE_DAMAGE = 5;

// MC formula (1.21):
// smash = 3 per block for first 3 blocks,
// +4 per block up to 8 blocks,
// +2 per block after 8 blocks.
// Density enchant adds +0.5 per level per block of fall.
export function computeMaceDamage(q: MaceAttackQuery): number {
  if (!q.critical || q.fallDistance <= 0) return BASE_DAMAGE;
  const f = q.fallDistance;
  let smash = 0;
  const a = Math.min(3, f);
  smash += a * 3;
  if (f > 3) {
    const b = Math.min(5, f - 3);
    smash += b * 4;
  }
  if (f > 8) {
    const c = f - 8;
    smash += c * 2;
  }
  if (q.densityLevel > 0) {
    smash += f * q.densityLevel * 0.5;
  }
  return BASE_DAMAGE + smash;
}

export interface CraftMaceQuery {
  heavyCore: number;
  breezeRod: number;
}

export function craftMace(q: CraftMaceQuery): { item: 'webmc:mace'; count: 1 } | null {
  if (q.heavyCore < 1 || q.breezeRod < 1) return null;
  return { item: 'webmc:mace', count: 1 };
}

// A successful smash resets fall-damage that would otherwise be applied to
// the attacker. Returns the fall-damage overflow (always 0 in MC).
export function smashAttackFallReset(fallDistance: number): number {
  if (fallDistance <= 0) return 0;
  return 0;
}

// Wind Burst enchant launches the attacker upward after a smash. Scales by
// level 1..3 with reducing cooldown, here modeled as simple impulse.
export function windBurstImpulse(level: number): number {
  if (level <= 0) return 0;
  const l = Math.min(3, level);
  return 0.7 + (l - 1) * 0.1;
}
