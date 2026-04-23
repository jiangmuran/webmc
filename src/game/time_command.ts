export type TimeAction = 'set' | 'add' | 'query';
export type TimeKey = 'day' | 'night' | 'noon' | 'midnight';

export const PRESETS: Record<TimeKey, number> = {
  day: 1000,
  noon: 6000,
  night: 13000,
  midnight: 18000,
};

export function resolveValue(input: string): number | undefined {
  if (input in PRESETS) return PRESETS[input as TimeKey];
  const n = Number(input);
  return Number.isFinite(n) ? n : undefined;
}

export function apply(current: number, action: TimeAction, value: number): number {
  if (action === 'set') return ((value % 24000) + 24000) % 24000;
  if (action === 'add') return (current + value) % 24000;
  return current;
}
