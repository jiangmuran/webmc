// Name tag — anvil + name on a paper-like item, used on a mob to give it
// a permanent name. Named mobs don't despawn and show their name above.
//
// Wiki (minecraft.wiki/w/Anvil): "The anvil rename text field accepts up
// to 50 characters." A renamed name tag carries that string verbatim,
// so the per-mob name cap matches anvil input. Sibling
// name_tag_rename.ts already uses 50; the old 40 here truncated names
// 10 chars shorter than vanilla allows.

export interface NamedMob {
  customName: string | null;
  customNameVisible: boolean;
}

const MAX_NAME_LEN = 50;

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
