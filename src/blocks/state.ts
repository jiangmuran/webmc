export type BlockId = number;

export type BlockState = number;

const ID_BITS = 16;
const ID_MASK = (1 << ID_BITS) - 1;
const PROPS_BITS = 16;
const PROPS_MASK = (1 << PROPS_BITS) - 1;

export const MAX_BLOCK_ID = ID_MASK;
export const MAX_PROPS = PROPS_MASK;

export function makeState(id: BlockId, props = 0): BlockState {
  return ((props & PROPS_MASK) << ID_BITS) | (id & ID_MASK);
}

export function stateId(s: BlockState): BlockId {
  return s & ID_MASK;
}

export function stateProps(s: BlockState): number {
  return (s >>> ID_BITS) & PROPS_MASK;
}

export const AIR_ID: BlockId = 0;
export const AIR: BlockState = 0;

export function isAir(s: BlockState): boolean {
  return stateId(s) === AIR_ID;
}
