// Armor stand pose. 6 limb rotations (head, body, L/R arm, L/R leg),
// plus arms/no_base_plate/small/invisible flags. Pose is edited by
// right-clicking with an item or (creative) copying an NBT snippet.

export interface EulerXYZ {
  x: number;
  y: number;
  z: number;
}

export interface ArmorStandPose {
  head: EulerXYZ;
  body: EulerXYZ;
  leftArm: EulerXYZ;
  rightArm: EulerXYZ;
  leftLeg: EulerXYZ;
  rightLeg: EulerXYZ;
}

export interface ArmorStand {
  pose: ArmorStandPose;
  small: boolean;
  invisible: boolean;
  showArms: boolean;
  noBasePlate: boolean;
  marker: boolean;
}

const ZERO: EulerXYZ = { x: 0, y: 0, z: 0 };

export function makeArmorStand(): ArmorStand {
  return {
    pose: {
      head: { ...ZERO },
      body: { ...ZERO },
      leftArm: { x: -10, y: 0, z: -10 },
      rightArm: { x: -15, y: 0, z: 10 },
      leftLeg: { x: -1, y: 0, z: -1 },
      rightLeg: { x: 1, y: 0, z: 1 },
    },
    small: false,
    invisible: false,
    showArms: false,
    noBasePlate: false,
    marker: false,
  };
}

// normalize angles to [-180, 180) so poses are canonical.
export function normalizeAngle(a: number): number {
  let v = ((((a + 180) % 360) + 360) % 360) - 180;
  if (v === 180) v = -180;
  return v;
}

export function normalizeEuler(e: EulerXYZ): EulerXYZ {
  return { x: normalizeAngle(e.x), y: normalizeAngle(e.y), z: normalizeAngle(e.z) };
}

// Damage: marker armor stand ignores damage.
export interface DamageQuery {
  amount: number;
  source: 'fire' | 'lava' | 'projectile' | 'melee' | 'void';
}

export function damageArmorStand(s: ArmorStand, q: DamageQuery): number {
  if (s.marker) return 0;
  if (q.source === 'void') return Infinity;
  return q.amount;
}
