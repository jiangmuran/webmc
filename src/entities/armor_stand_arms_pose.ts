export interface Pose {
  headYawDeg: number;
  headPitchDeg: number;
  leftArmPitch: number;
  rightArmPitch: number;
  bodyYaw: number;
  leftLegPitch: number;
  rightLegPitch: number;
}

export const DEFAULT_POSE: Pose = {
  headYawDeg: 0,
  headPitchDeg: 0,
  leftArmPitch: 0,
  rightArmPitch: 0,
  bodyYaw: 0,
  leftLegPitch: 0,
  rightLegPitch: 0,
};

export function clampPoseAngle(deg: number): number {
  return Math.max(-180, Math.min(180, deg));
}

export function setHeadPose(p: Pose, yaw: number, pitch: number): Pose {
  return { ...p, headYawDeg: clampPoseAngle(yaw), headPitchDeg: clampPoseAngle(pitch) };
}
