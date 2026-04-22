// Parrot on player shoulder. Tamed parrots hop onto the owner's
// shoulder when the owner right-clicks them. Shoulder parrot falls off
// on damage, water, or dismount. Max 2 (one per shoulder).

export type Shoulder = 'left' | 'right';

export interface ShoulderEntry {
  variant: number; // 0..4 parrot color
  shoulder: Shoulder;
}

export interface Player {
  shoulderEntries: ShoulderEntry[];
}

export function canPerch(p: Player, shoulder: Shoulder): boolean {
  return !p.shoulderEntries.some((e) => e.shoulder === shoulder);
}

export function perch(p: Player, variant: number, shoulder: Shoulder): boolean {
  if (!canPerch(p, shoulder)) return false;
  p.shoulderEntries.push({ variant, shoulder });
  return true;
}

export function dropAll(p: Player): ShoulderEntry[] {
  const out = [...p.shoulderEntries];
  p.shoulderEntries.length = 0;
  return out;
}

export type DropTrigger = 'damage' | 'water' | 'sprint_jump' | 'dismount_horse' | 'sleep';

export function maybeDrop(p: Player, trigger: DropTrigger): ShoulderEntry[] {
  // MC: damage and water drop; sleep also drops. Sprint-jump does not.
  if (trigger === 'sprint_jump' || trigger === 'dismount_horse') return [];
  return dropAll(p);
}
