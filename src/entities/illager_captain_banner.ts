export interface Illager {
  type: 'pillager' | 'vindicator' | 'evoker' | 'illusioner' | 'ravager';
  hasBannerOnHead: boolean;
}

export function isRaidCaptain(i: Illager): boolean {
  return (i.type === 'pillager' || i.type === 'vindicator') && i.hasBannerOnHead;
}

export function killGrantsOmen(i: Illager): boolean {
  return isRaidCaptain(i);
}

export function omenLevelFromKill(): number {
  return 1;
}
