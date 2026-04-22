// Advanced redstone component behaviors: repeater, comparator, observer, hopper.
// Each is a pure function over a minimal state model; integration (tile
// entities, scheduler ticks, item move) is a separate concern.

// ─── Repeater ─────────────────────────────────────────────────────────
// A repeater has: delay (1-4 ticks) + input level + output level.
// On each redstone tick, input's level shifts through a delay queue.

export interface RepeaterState {
  delay: 1 | 2 | 3 | 4;
  queue: boolean[]; // oldest first, length = delay
  output: boolean;
  locked: boolean; // side-input lock
}

export function makeRepeater(delay: 1 | 2 | 3 | 4 = 1): RepeaterState {
  return {
    delay,
    queue: Array.from({ length: delay }, () => false),
    output: false,
    locked: false,
  };
}

export function tickRepeater(state: RepeaterState, input: boolean): RepeaterState {
  if (state.locked) return state;
  const nextQueue = state.queue.slice(1);
  nextQueue.push(input);
  const nextOutput = nextQueue[0] ?? false;
  return { ...state, queue: nextQueue, output: nextOutput };
}

// ─── Comparator ────────────────────────────────────────────────────────
// Two modes: 'compare' (output = max(back, side) if back >= side else 0) and
// 'subtract' (output = max(0, back - max(sides))). Signal strength 0-15.

export type ComparatorMode = 'compare' | 'subtract';

export function compareSignals(
  back: number,
  leftSide: number,
  rightSide: number,
  mode: ComparatorMode,
): number {
  const sideMax = Math.max(leftSide, rightSide);
  if (mode === 'subtract') return Math.max(0, back - sideMax);
  return back >= sideMax ? back : 0;
}

// Container comparator output: 1 (any item) to 14 (full) + 1 linear formula.
// stacks is an array of {count, maxStack}. Empty container = 0.
export function comparatorFromContainer(
  stacks: readonly { count: number; maxStack: number }[],
): number {
  if (stacks.length === 0) return 0;
  let filledSlots = 0;
  let fraction = 0;
  for (const s of stacks) {
    if (s.count > 0) {
      filledSlots++;
      fraction += s.count / s.maxStack;
    }
  }
  if (filledSlots === 0) return 0;
  return Math.floor(1 + (fraction / stacks.length) * 14);
}

// ─── Observer ──────────────────────────────────────────────────────────
// Observers pulse for exactly 1 tick when the watched block's state changes.

export interface ObserverState {
  lastObservedHash: number;
  pulseTicksRemaining: number;
}

export function makeObserver(): ObserverState {
  return { lastObservedHash: 0, pulseTicksRemaining: 0 };
}

export function tickObserver(state: ObserverState, observedHash: number): ObserverState {
  const changed = observedHash !== state.lastObservedHash;
  return {
    lastObservedHash: observedHash,
    pulseTicksRemaining: changed ? 1 : Math.max(0, state.pulseTicksRemaining - 1),
  };
}

export function observerOutput(state: ObserverState): boolean {
  return state.pulseTicksRemaining > 0;
}

// ─── Hopper ────────────────────────────────────────────────────────────
// Transfer one item stack slot per tick from a source container to a dest.
// Returns the updated source/dest arrays. Naive: picks first non-empty src
// slot + first matching-or-empty dest slot.

export interface ItemStackSlot {
  itemId: number;
  count: number;
  damage: number;
}

export interface HopperTransfer {
  source: readonly (ItemStackSlot | null)[];
  dest: readonly (ItemStackSlot | null)[];
  transferred: boolean;
}

const HOPPER_TRANSFER_COUNT = 1;

export function hopperStep(
  source: readonly (ItemStackSlot | null)[],
  dest: readonly (ItemStackSlot | null)[],
  maxStack: (itemId: number) => number,
): HopperTransfer {
  const srcIdx = source.findIndex((s) => s !== null && s.count > 0);
  if (srcIdx < 0) return { source, dest, transferred: false };
  const srcSlot = source[srcIdx];
  if (!srcSlot) return { source, dest, transferred: false };

  const max = maxStack(srcSlot.itemId);

  const destIdx = dest.findIndex((d) => {
    if (d === null) return true;
    if (d.itemId !== srcSlot.itemId) return false;
    if (d.damage !== srcSlot.damage) return false;
    return d.count < max;
  });
  if (destIdx < 0) return { source, dest, transferred: false };

  const newSrc = [...source];
  const newDest = [...dest];
  const moveCount = Math.min(HOPPER_TRANSFER_COUNT, srcSlot.count);

  const existing = newDest[destIdx];
  if (existing === null || existing === undefined) {
    newDest[destIdx] = { itemId: srcSlot.itemId, count: moveCount, damage: srcSlot.damage };
  } else {
    newDest[destIdx] = { ...existing, count: existing.count + moveCount };
  }
  const newCount = srcSlot.count - moveCount;
  newSrc[srcIdx] = newCount > 0 ? { ...srcSlot, count: newCount } : null;

  return { source: newSrc, dest: newDest, transferred: true };
}
