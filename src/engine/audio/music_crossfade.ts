export const CROSSFADE_DURATION_MS = 2000;

export interface MusicTransition {
  fromId?: string;
  toId?: string;
  progress01: number;
  startedAtMs: number;
}

export function startTransition(
  fromId: string | undefined,
  toId: string,
  now: number,
): MusicTransition {
  const base: MusicTransition = { toId, progress01: 0, startedAtMs: now };
  if (fromId !== undefined) base.fromId = fromId;
  return base;
}

export function updateProgress(t: MusicTransition, nowMs: number): MusicTransition {
  const elapsed = nowMs - t.startedAtMs;
  return { ...t, progress01: Math.max(0, Math.min(1, elapsed / CROSSFADE_DURATION_MS)) };
}

export function fromVolume(t: MusicTransition): number {
  return 1 - t.progress01;
}

export function toVolume(t: MusicTransition): number {
  return t.progress01;
}

export function finished(t: MusicTransition): boolean {
  return t.progress01 >= 1;
}
