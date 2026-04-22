// Shield block mechanics. When the player holds right-click with a shield
// equipped, incoming frontal damage is mitigated. A successful block
// damages the shield by 1 per hit (up to its durability).

export interface Direction {
  x: number;
  y: number;
  z: number;
}

export interface ShieldBlockQuery {
  incomingDirection: Direction; // unit vector from attacker to player
  playerForward: Direction; // player's view forward
  isBlocking: boolean; // right-click is held
  shieldDurability: number; // current HP of the shield
  disabled: boolean; // axe-disabled shields can't block for 5s
}

export interface ShieldBlockResult {
  blocked: boolean;
  damageMultiplier: number; // 0..1 — 0 = fully blocked, 1 = no mitigation
  shieldDamage: number; // integer
}

export function attemptShieldBlock(q: ShieldBlockQuery): ShieldBlockResult {
  if (!q.isBlocking || q.disabled || q.shieldDurability <= 0) {
    return { blocked: false, damageMultiplier: 1, shieldDamage: 0 };
  }
  // Dot product: -1 = attacker directly in front, 1 = directly behind.
  // MC requires attacker within ~100° arc in front: dot < -0.342.
  const dot =
    q.incomingDirection.x * q.playerForward.x +
    q.incomingDirection.y * q.playerForward.y +
    q.incomingDirection.z * q.playerForward.z;
  if (dot >= -0.342) {
    return { blocked: false, damageMultiplier: 1, shieldDamage: 0 };
  }
  // Blocked.
  return { blocked: true, damageMultiplier: 0, shieldDamage: 1 };
}
