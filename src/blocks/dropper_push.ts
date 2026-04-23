// Dropper: on redstone pulse, pick random non-empty slot and either
// insert into facing container or spawn item.

export interface DropperSlot {
  id: string | null;
  count: number;
}

export function pickRandomNonEmpty(slots: DropperSlot[], rand: () => number): number {
  const candidates: number[] = [];
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (s && s.id !== null && s.count > 0) candidates.push(i);
  }
  if (candidates.length === 0) return -1;
  const idx = Math.floor(rand() * candidates.length);
  return candidates[idx] ?? -1;
}

export type DropOutcome = { kind: 'inserted' } | { kind: 'spawned_item' } | { kind: 'no_op' };

export function dispense(
  slots: DropperSlot[],
  facingContainerHasSpace: boolean,
  rand: () => number,
): DropOutcome {
  const idx = pickRandomNonEmpty(slots, rand);
  if (idx < 0) return { kind: 'no_op' };
  const s = slots[idx];
  if (!s) return { kind: 'no_op' };
  s.count -= 1;
  if (s.count === 0) s.id = null;
  return facingContainerHasSpace ? { kind: 'inserted' } : { kind: 'spawned_item' };
}
