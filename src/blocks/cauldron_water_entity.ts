// Cauldron water interactions. Burning entity in water cauldron
// extinguishes. Dye → dyes leather armor. Washes banners. Potion
// bottle → potion cauldron.

export type CauldronContent = 'empty' | 'water' | 'lava' | 'powder_snow';

export interface Cauldron {
  content: CauldronContent;
  level: 0 | 1 | 2 | 3;
}

export interface EntityInteract {
  isOnFire: boolean;
  hasLeatherArmor: boolean;
  leatherColor: string | null;
}

export interface InteractResult {
  extinguishedFire: boolean;
  washedArmor: boolean;
  levelAfter: 0 | 1 | 2 | 3;
}

export function entityStep(c: Cauldron, e: EntityInteract): InteractResult {
  const r: InteractResult = {
    extinguishedFire: false,
    washedArmor: false,
    levelAfter: c.level,
  };
  if (c.content !== 'water' || c.level === 0) return r;
  if (e.isOnFire) {
    r.extinguishedFire = true;
    r.levelAfter = Math.max(0, c.level - 1) as 0 | 1 | 2 | 3;
    c.level = r.levelAfter;
    if (c.level === 0) c.content = 'empty';
    return r;
  }
  if (e.hasLeatherArmor && e.leatherColor !== null) {
    r.washedArmor = true;
    r.levelAfter = Math.max(0, c.level - 1) as 0 | 1 | 2 | 3;
    c.level = r.levelAfter;
    if (c.level === 0) c.content = 'empty';
  }
  return r;
}

// Lava cauldron sets nearby entities on fire.
export interface LavaQuery {
  standingInLavaCauldron: boolean;
}

export function lavaCauldronIgnites(q: LavaQuery): boolean {
  return q.standingInLavaCauldron;
}
