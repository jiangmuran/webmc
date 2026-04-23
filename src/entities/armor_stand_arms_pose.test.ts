import { describe, it, expect } from 'vitest';
import { DEFAULT_POSE, clampPoseAngle, setHeadPose } from './armor_stand_arms_pose';

describe('armor stand arms pose', () => {
  it('default flat', () => {
    expect(DEFAULT_POSE.headYawDeg).toBe(0);
  });

  it('clamps beyond 180', () => {
    expect(clampPoseAngle(500)).toBe(180);
    expect(clampPoseAngle(-500)).toBe(-180);
  });

  it('set head pose', () => {
    const p = setHeadPose(DEFAULT_POSE, 30, -45);
    expect(p.headYawDeg).toBe(30);
    expect(p.headPitchDeg).toBe(-45);
  });
});
