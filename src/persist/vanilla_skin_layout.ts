// Vanilla skin texture layout. Modern skins are 64×64 PNGs with a
// well-known UV layout (the legacy 64×32 single-arm layout is also
// supported). Each named region is a 4-tuple [x, y, width, height] in
// pixels.
//
// Source: minecraft.wiki "Player skin". Behavioral spec — clean-room.

export type Rect = readonly [number, number, number, number];
export type SkinLayout = Readonly<Record<string, Rect>>;

// 64×64 modern skin (Steve & Alex). Includes both layers (body + overlay)
// and right-/left-arm regions.
export const SKIN_LAYOUT_64X64: SkinLayout = Object.freeze({
  // Head: 8×8 cube faces.
  head_front: [8, 8, 8, 8],
  head_back: [24, 8, 8, 8],
  head_top: [8, 0, 8, 8],
  head_bottom: [16, 0, 8, 8],
  head_left: [0, 8, 8, 8],
  head_right: [16, 8, 8, 8],
  // Hat overlay (8×8 around the head).
  hat_front: [40, 8, 8, 8],
  hat_back: [56, 8, 8, 8],
  hat_top: [40, 0, 8, 8],
  hat_bottom: [48, 0, 8, 8],
  hat_left: [32, 8, 8, 8],
  hat_right: [48, 8, 8, 8],
  // Torso: 8×12.
  body_front: [20, 20, 8, 12],
  body_back: [32, 20, 8, 12],
  body_top: [20, 16, 8, 4],
  body_bottom: [28, 16, 8, 4],
  body_left: [16, 20, 4, 12],
  body_right: [28, 20, 4, 12],
  // Right arm (Steve: 4 wide, Alex: 3 wide).
  right_arm_front: [44, 20, 4, 12],
  right_arm_back: [52, 20, 4, 12],
  right_arm_top: [44, 16, 4, 4],
  right_arm_bottom: [48, 16, 4, 4],
  right_arm_left: [40, 20, 4, 12],
  right_arm_right: [48, 20, 4, 12],
  // Left arm (modern 64×64 only — legacy 64×32 mirrored the right arm).
  left_arm_front: [36, 52, 4, 12],
  left_arm_back: [44, 52, 4, 12],
  left_arm_top: [36, 48, 4, 4],
  left_arm_bottom: [40, 48, 4, 4],
  left_arm_left: [32, 52, 4, 12],
  left_arm_right: [40, 52, 4, 12],
  // Right leg.
  right_leg_front: [4, 20, 4, 12],
  right_leg_back: [12, 20, 4, 12],
  right_leg_top: [4, 16, 4, 4],
  right_leg_bottom: [8, 16, 4, 4],
  right_leg_left: [0, 20, 4, 12],
  right_leg_right: [8, 20, 4, 12],
  // Left leg (modern 64×64 only).
  left_leg_front: [20, 52, 4, 12],
  left_leg_back: [28, 52, 4, 12],
  left_leg_top: [20, 48, 4, 4],
  left_leg_bottom: [24, 48, 4, 4],
  left_leg_left: [16, 52, 4, 12],
  left_leg_right: [24, 52, 4, 12],
});

// Legacy 64×32 layout: only the right arm/leg are stored, body mirror
// for the left side. We expose only the directly-stored regions.
export const SKIN_LAYOUT_64X32: SkinLayout = Object.freeze({
  head_front: [8, 8, 8, 8],
  head_back: [24, 8, 8, 8],
  head_top: [8, 0, 8, 8],
  head_bottom: [16, 0, 8, 8],
  head_left: [0, 8, 8, 8],
  head_right: [16, 8, 8, 8],
  hat_front: [40, 8, 8, 8],
  hat_back: [56, 8, 8, 8],
  hat_top: [40, 0, 8, 8],
  hat_bottom: [48, 0, 8, 8],
  hat_left: [32, 8, 8, 8],
  hat_right: [48, 8, 8, 8],
  body_front: [20, 20, 8, 12],
  body_back: [32, 20, 8, 12],
  body_top: [20, 16, 8, 4],
  body_bottom: [28, 16, 8, 4],
  body_left: [16, 20, 4, 12],
  body_right: [28, 20, 4, 12],
  right_arm_front: [44, 20, 4, 12],
  right_arm_back: [52, 20, 4, 12],
  right_arm_top: [44, 16, 4, 4],
  right_arm_bottom: [48, 16, 4, 4],
  right_arm_left: [40, 20, 4, 12],
  right_arm_right: [48, 20, 4, 12],
  right_leg_front: [4, 20, 4, 12],
  right_leg_back: [12, 20, 4, 12],
  right_leg_top: [4, 16, 4, 4],
  right_leg_bottom: [8, 16, 4, 4],
  right_leg_left: [0, 20, 4, 12],
  right_leg_right: [8, 20, 4, 12],
});

export function pickSkinLayout(width: number, height: number): SkinLayout | null {
  if (width === 64 && height === 64) return SKIN_LAYOUT_64X64;
  if (width === 64 && height === 32) return SKIN_LAYOUT_64X32;
  return null;
}
