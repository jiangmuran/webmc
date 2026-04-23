export type BossColor = 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';
export type BossStyle = 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20';

export interface Boss {
  name: string;
  hp: number;
  maxHp: number;
  color: BossColor;
  style: BossStyle;
  visible: boolean;
}

export function progressFraction(b: Boss): number {
  if (b.maxHp <= 0) return 0;
  return Math.max(0, Math.min(1, b.hp / b.maxHp));
}

export function notchCount(style: BossStyle): number {
  switch (style) {
    case 'progress':
      return 0;
    case 'notched_6':
      return 6;
    case 'notched_10':
      return 10;
    case 'notched_12':
      return 12;
    case 'notched_20':
      return 20;
  }
}
