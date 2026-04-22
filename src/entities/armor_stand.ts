// Armor stand — a posable dummy entity. 4 armor slots + 2 hand slots +
// pose angles for 6 body parts. Rotated by hand interaction; painted
// with name tag.

import type { ItemStack } from '@/items/item';

export type ArmorStandSlot =
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots'
  | 'main_hand'
  | 'off_hand';

export interface PoseAngles {
  head: readonly [number, number, number];
  body: readonly [number, number, number];
  leftArm: readonly [number, number, number];
  rightArm: readonly [number, number, number];
  leftLeg: readonly [number, number, number];
  rightLeg: readonly [number, number, number];
}

export interface ArmorStandState {
  slots: Record<ArmorStandSlot, ItemStack | null>;
  pose: PoseAngles;
  showArms: boolean;
  small: boolean; // mini armor stand
  hasBasePlate: boolean;
  invisible: boolean;
  customName: string | null;
}

const DEFAULT_POSE: PoseAngles = {
  head: [0, 0, 0],
  body: [0, 0, 0],
  leftArm: [-10, 0, -10],
  rightArm: [-15, 0, 10],
  leftLeg: [-1, 0, -1],
  rightLeg: [1, 0, 1],
};

export function makeArmorStand(): ArmorStandState {
  return {
    slots: {
      helmet: null,
      chestplate: null,
      leggings: null,
      boots: null,
      main_hand: null,
      off_hand: null,
    },
    pose: { ...DEFAULT_POSE },
    showArms: false,
    small: false,
    hasBasePlate: true,
    invisible: false,
    customName: null,
  };
}

export function equipSlot(
  state: ArmorStandState,
  slot: ArmorStandSlot,
  stack: ItemStack,
): ItemStack | null {
  const prev = state.slots[slot];
  state.slots[slot] = { ...stack, count: 1 };
  return prev;
}

export function setPose(state: ArmorStandState, updated: Partial<PoseAngles>): void {
  state.pose = { ...state.pose, ...updated };
}
