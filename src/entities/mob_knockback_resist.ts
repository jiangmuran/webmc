// Mob knockback resistance attribute. Each mob has a 0..1 resistance
// value; knockback is scaled by (1 - resistance). Iron golems, Warden,
// Wither are heavily resistant; rabbits and ocelots aren't.

const RESISTANCE: Record<string, number> = {
  iron_golem: 1.0,
  warden: 1.0,
  wither: 1.0,
  ravager: 0.75,
  ender_dragon: 1.0,
  zombie: 0,
  skeleton: 0,
  creeper: 0,
  spider: 0,
  cow: 0,
  sheep: 0,
  chicken: 0,
  pig: 0,
  horse: 0,
  wolf: 0,
  cat: 0,
  hoglin: 0.5,
  zoglin: 0.5,
  piglin_brute: 0.5,
  elder_guardian: 0,
  guardian: 0,
  evoker: 0,
  vindicator: 0,
  pillager: 0,
  witch: 0,
  blaze: 0,
  ghast: 0,
  enderman: 0,
  breeze: 0,
  allay: 0,
  camel: 1.0,
};

export function resistanceFor(mob: string): number {
  return RESISTANCE[mob] ?? 0;
}

// Scale an incoming knockback velocity by the target's resistance.
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function applyKnockbackResistance(knockback: Vec3, mob: string): Vec3 {
  const r = Math.max(0, Math.min(1, resistanceFor(mob)));
  const factor = 1 - r;
  return {
    x: knockback.x * factor,
    y: knockback.y * factor,
    z: knockback.z * factor,
  };
}

// Non-armor knockback reduction sources: absorption (from armor),
// shield blocking, resistance potion don't reduce knockback; only the
// attribute does.
export function totalResistance(mobAttribute: number, armorBoost: number): number {
  return Math.max(0, Math.min(1, mobAttribute + armorBoost));
}
