// Recovery compass (1.19). Points at the last death location of the
// holding player in the current dimension. If the player hasn't died yet,
// or is in a different dimension from their death, spins randomly.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface DeathRecord {
  pos: Vec3;
  dimension: string;
}

export interface RecoveryQuery {
  holderPos: Vec3;
  holderDimension: string;
  lastDeath: DeathRecord | null;
}

export interface RecoveryResult {
  valid: boolean;
  pointingYawRad: number;
}

export function recoveryCompassReading(q: RecoveryQuery): RecoveryResult {
  if (q.lastDeath?.dimension !== q.holderDimension) {
    return { valid: false, pointingYawRad: Math.random() * Math.PI * 2 };
  }
  const dx = q.lastDeath.pos.x - q.holderPos.x;
  const dz = q.lastDeath.pos.z - q.holderPos.z;
  return { valid: true, pointingYawRad: Math.atan2(dz, dx) };
}

// A compass recipe requires 8 echo shards + 1 regular compass.
export interface CraftRecoveryQuery {
  echoShards: number;
  compasses: number;
}

export function craftRecoveryCompass(q: CraftRecoveryQuery): {
  item: 'webmc:recovery_compass';
  count: 1;
} | null {
  if (q.echoShards < 8 || q.compasses < 1) return null;
  return { item: 'webmc:recovery_compass', count: 1 };
}

// Death record update hook: overwrites the previous record with the
// latest death position (compass always points at the *most recent*).
export function recordDeath(
  _previous: DeathRecord | null,
  pos: Vec3,
  dimension: string,
): DeathRecord {
  return { pos: { ...pos }, dimension };
}
