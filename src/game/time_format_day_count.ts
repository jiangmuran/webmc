export function dayCount(totalTicks: number): number {
  return Math.floor(totalTicks / 24000);
}

export function timeInDay(totalTicks: number): number {
  return ((totalTicks % 24000) + 24000) % 24000;
}

export function phaseOfDay(totalTicks: number): 'dawn' | 'day' | 'dusk' | 'night' {
  const t = timeInDay(totalTicks);
  if (t < 1000) return 'dawn';
  if (t < 12000) return 'day';
  if (t < 13000) return 'dusk';
  return 'night';
}

export function formatDayTime(totalTicks: number): string {
  const t = timeInDay(totalTicks);
  const hours = Math.floor(t / 1000 + 6) % 24;
  const minutes = Math.floor(((t % 1000) / 1000) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
