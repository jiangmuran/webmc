// Name tag — anvil + name on a paper-like item, used on a mob to give it
// a permanent name. Named mobs don't despawn and show their name above.

export interface NamedMob {
  customName: string | null;
  customNameVisible: boolean;
}

const MAX_NAME_LEN = 40;

export function renameViaTag(mob: NamedMob, tagName: string | null): boolean {
  if (!tagName || tagName.length === 0) return false;
  mob.customName = tagName.slice(0, MAX_NAME_LEN);
  mob.customNameVisible = true;
  return true;
}

export function clearName(mob: NamedMob): void {
  mob.customName = null;
  mob.customNameVisible = false;
}

// Dinnerbone / Grumm names flip the mob upside down (classic easter egg).
export function isUpsideDownName(name: string | null): boolean {
  if (!name) return false;
  return name === 'Dinnerbone' || name === 'Grumm';
}

// Toast / Rabbit + "Toast" names the rabbit after the dev's wife's pet.
export function isSpecialRabbitName(name: string | null): boolean {
  return name === 'Toast';
}

// jeb_ rainbow sheep.
export function isRainbowSheepName(name: string | null): boolean {
  return name === 'jeb_';
}
