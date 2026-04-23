export interface PoseCheck {
  centerBlock: string;
  arms: [string, string];
  legs: string;
  headAboveCenter: string;
}

export const CENTER_REQUIRED = 'iron_block';
export const ARMS_REQUIRED = 'iron_block';
export const LEGS_REQUIRED = 'iron_block';
export const HEAD_REQUIRED = 'carved_pumpkin';

export function isValidPose(p: PoseCheck): boolean {
  if (p.centerBlock !== CENTER_REQUIRED) return false;
  if (p.arms[0] !== ARMS_REQUIRED || p.arms[1] !== ARMS_REQUIRED) return false;
  if (p.legs !== LEGS_REQUIRED) return false;
  return p.headAboveCenter === HEAD_REQUIRED || p.headAboveCenter === 'jack_o_lantern';
}

export function alsoAcceptsJackOLantern(): boolean {
  return true;
}
