export const HEARTS_PER_ROW = 10;
export const HP_PER_HEART = 2;

export type HeartIcon = 'full' | 'half' | 'empty';

export function hearts(hp: number, maxHp: number): HeartIcon[] {
  const totalHearts = Math.ceil(maxHp / HP_PER_HEART);
  const out: HeartIcon[] = [];
  for (let i = 0; i < totalHearts; i++) {
    const delta = hp - i * HP_PER_HEART;
    if (delta >= HP_PER_HEART) out.push('full');
    else if (delta >= 1) out.push('half');
    else out.push('empty');
  }
  return out;
}
