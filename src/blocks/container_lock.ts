// Container "Lock" NBT. If set, player must be holding an item whose
// custom name matches the lock string to open.

export interface LockedContainer {
  lock: string | null;
}

export function canOpen(c: LockedContainer, heldItemCustomName: string | null): boolean {
  if (!c.lock) return true;
  return c.lock === heldItemCustomName;
}

export function setLock(c: LockedContainer, lock: string | null): LockedContainer {
  return { ...c, lock };
}

export const LOCK_ERROR_MESSAGE = 'Locked: requires named key';
